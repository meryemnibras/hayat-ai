import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clinicId = searchParams.get("clinicId");

  if (!clinicId) {
    return new Response("clinicId is required", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial connection message
      send({ type: "connected", timestamp: new Date().toISOString() });

      // Poll for updates every 2 seconds
      let lastCheck = new Date();
      const interval = setInterval(async () => {
        try {
          const since = lastCheck;
          lastCheck = new Date();

          // Check for new messages
          const newMessages = await prisma.message.findMany({
            where: {
              conversation: {
                clinicId,
              },
              createdAt: {
                gte: since,
              },
            },
            include: {
              conversation: {
                include: {
                  patient: {
                    select: {
                      id: true,
                      fullName: true,
                    },
                  },
                },
              },
            },
            take: 10,
          });

          newMessages.forEach((message) => {
            send({
              event: "new_message",
              data: {
                id: message.id,
                conversationId: message.conversationId,
                senderType: message.senderType,
                content: message.content,
                patient: message.conversation.patient,
              },
              timestamp: message.createdAt.toISOString(),
            });
          });

          // Check for new appointments
          const newAppointments = await prisma.appointment.findMany({
            where: {
              clinicId,
              createdAt: {
                gte: since,
              },
            },
            include: {
              patient: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
              doctor: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
            take: 10,
          });

          newAppointments.forEach((appointment) => {
            send({
              event: "new_appointment",
              data: {
                id: appointment.id,
                patient: appointment.patient,
                doctor: appointment.doctor,
                startTime: appointment.startTime,
                status: appointment.status,
              },
              timestamp: appointment.createdAt.toISOString(),
            });
          });
        } catch (error) {
          console.error("[SSE] Error:", error);
          send({ type: "error", message: "Failed to fetch updates" });
        }
      }, 2000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

