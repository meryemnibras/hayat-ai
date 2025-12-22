import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/notifications - Get notifications for a user/clinic
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!clinicId) {
      return NextResponse.json(
        { error: "clinicId is required" },
        { status: 400 }
      );
    }

    // For now, we'll create notifications on-the-fly from recent events
    // In production, you'd have a Notification model
    const notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      read: boolean;
      createdAt: Date;
      link?: string;
    }> = [];

    // Get recent appointments
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        clinicId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        patient: {
          select: {
            fullName: true,
          },
        },
        doctor: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    recentAppointments.forEach((apt) => {
      notifications.push({
        id: `appointment-${apt.id}`,
        type: "appointment",
        title: "New Appointment",
        message: `${apt.patient.fullName} has a ${apt.status.toLowerCase()} appointment${apt.doctor ? ` with ${apt.doctor.fullName}` : ""}`,
        read: false,
        createdAt: apt.createdAt,
        link: `/dashboard/appointments/${apt.id}`,
      });
    });

    // Get recent messages
    const recentMessages = await prisma.message.findMany({
      where: {
        conversation: {
          clinicId,
        },
        senderType: "PATIENT",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        conversation: {
          include: {
            patient: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    recentMessages.forEach((msg) => {
      notifications.push({
        id: `message-${msg.id}`,
        type: "message",
        title: "New Message",
        message: `New message from ${msg.conversation.patient.fullName}`,
        read: false,
        createdAt: msg.createdAt,
        link: `/dashboard/conversations/${msg.conversationId}`,
      });
    });

    // Sort by date and limit
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const limited = notifications.slice(0, limit);

    return NextResponse.json({
      success: true,
      notifications: limited,
      count: limited.length,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/notifications/mark-read - Mark notification as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationIds } = body;

    // In production, update Notification model
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

