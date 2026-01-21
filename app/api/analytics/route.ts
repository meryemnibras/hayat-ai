import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const end = endDate ? new Date(endDate) : new Date();

    // Appointments statistics
    const totalAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ["status"],
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
    });

    // Daily appointments trend
    const dailyAppointments = await prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as count
      FROM "Appointment"
      WHERE "createdAt" >= ${start}
        AND "createdAt" <= ${end}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Conversations statistics
    const totalConversations = await prisma.conversation.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const messagesCount = await prisma.message.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return NextResponse.json({
      success: true,
      analytics: {
        period: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
        appointments: {
          total: totalAppointments,
          byStatus: appointmentsByStatus.map((item) => ({
            status: item.status,
            count: item._count,
          })),
          dailyTrend: dailyAppointments,
        },
        conversations: {
          total: totalConversations,
          messages: messagesCount,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}













