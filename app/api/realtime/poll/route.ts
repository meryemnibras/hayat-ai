import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const since = searchParams.get("since");
    const events = searchParams.get("events")?.split(",") || [];

    const sinceDate = since ? new Date(since) : new Date(Date.now() - 60000); // Default: last minute
    const updates: Array<{
      event: string;
      data: Record<string, unknown>;
      timestamp: string;
    }> = [];

    // Check for new messages
    if (events.includes("new_message") || events.length === 0) {
      const newMessages = await prisma.message.findMany({
        where: {
          ...(userId && {
            conversation: {
              userId,
            },
          }),
          createdAt: {
            gte: sinceDate,
          },
        },
        include: {
          conversation: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        take: 50,
      });

      newMessages.forEach((message) => {
        updates.push({
          event: "new_message",
          data: {
            id: message.id,
            conversationId: message.conversationId,
            role: message.role,
            content: message.content,
            user: message.conversation.user,
            createdAt: message.createdAt,
          },
          timestamp: message.createdAt.toISOString(),
        });
      });
    }

    // Check for new appointments
    if (events.includes("new_appointment") || events.length === 0) {
      const newAppointments = await prisma.appointment.findMany({
        where: {
          ...(userId && { userId }),
          createdAt: {
            gte: sinceDate,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        take: 50,
      });

      newAppointments.forEach((appointment) => {
        updates.push({
          event: "new_appointment",
          data: {
            id: appointment.id,
            user: appointment.user,
            doctorName: appointment.doctorName,
            treatment: appointment.treatment,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            createdAt: appointment.createdAt,
          },
          timestamp: appointment.createdAt.toISOString(),
        });
      });
    }

    // Check for appointment updates
    if (events.includes("appointment_update") || events.length === 0) {
      const updatedAppointments = await prisma.appointment.findMany({
        where: {
          ...(userId && { userId }),
          updatedAt: {
            gte: sinceDate,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: 50,
      });

      updatedAppointments.forEach((appointment) => {
        updates.push({
          event: "appointment_update",
          data: {
            id: appointment.id,
            user: appointment.user,
            status: appointment.status,
            date: appointment.date,
            time: appointment.time,
            updatedAt: appointment.updatedAt,
          },
          timestamp: appointment.updatedAt.toISOString(),
        });
      });
    }

    return NextResponse.json(updates);
  } catch (error: any) {
    console.error("Error polling real-time updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates", details: error.message },
      { status: 500 }
    );
  }
}
