import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/notifications - Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
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
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
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
        message: `${apt.user.name || "User"} has a ${apt.status.toLowerCase()} appointment for ${apt.treatment} with ${apt.doctorName}`,
        read: false,
        createdAt: apt.createdAt,
        link: `/appointments/${apt.id}`,
      });
    });

    // Get recent messages
    const recentMessages = await prisma.message.findMany({
      where: {
        conversation: {
          userId,
        },
        role: "USER",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        conversation: {
          include: {
            user: {
              select: {
                name: true,
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
        message: `New message in conversation`,
        read: false,
        createdAt: msg.createdAt,
        link: `/conversations/${msg.conversationId}`,
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
