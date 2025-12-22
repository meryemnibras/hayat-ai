import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const since = searchParams.get("since");
    const events = searchParams.get("events")?.split(",") || [];

    if (!clinicId) {
      return NextResponse.json(
        { error: "clinicId is required" },
        { status: 400 }
      );
    }

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
          conversation: {
            clinicId,
          },
          createdAt: {
            gte: sinceDate,
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
        take: 50,
      });

      newMessages.forEach((message) => {
        updates.push({
          event: "new_message",
          data: {
            id: message.id,
            conversationId: message.conversationId,
            senderType: message.senderType,
            content: message.content,
            patient: message.conversation.patient,
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
          clinicId,
          createdAt: {
            gte: sinceDate,
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
              specialization: true,
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
            patient: appointment.patient,
            doctor: appointment.doctor,
            startTime: appointment.startTime,
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
          clinicId,
          updatedAt: {
            gte: sinceDate,
          },
        },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
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
            patient: appointment.patient,
            status: appointment.status,
            startTime: appointment.startTime,
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

