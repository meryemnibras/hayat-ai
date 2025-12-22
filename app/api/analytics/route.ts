import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!clinicId) {
      return NextResponse.json(
        { error: "clinicId is required" },
        { status: 400 }
      );
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const end = endDate ? new Date(endDate) : new Date();

    // Appointments statistics
    const totalAppointments = await prisma.appointment.count({
      where: {
        clinicId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ["status"],
      where: {
        clinicId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
    });

    const appointmentsBySource = await prisma.appointment.groupBy({
      by: ["source"],
      where: {
        clinicId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
    });

    // Patients statistics
    const totalPatients = await prisma.patient.count({
      where: {
        clinicId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // Conversations statistics
    const totalConversations = await prisma.conversation.count({
      where: {
        clinicId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const messagesCount = await prisma.message.count({
      where: {
        conversation: {
          clinicId,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // Daily appointments trend
    const dailyAppointments = await prisma.$queryRaw<Array<{ date: string; count: number }>>`
      SELECT 
        DATE(created_at) as date,
        COUNT(*)::int as count
      FROM "Appointment"
      WHERE clinic_id = ${clinicId}
        AND created_at >= ${start}
        AND created_at <= ${end}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Top doctors by appointments
    const topDoctors = await prisma.appointment.groupBy({
      by: ["doctorId"],
      where: {
        clinicId,
        doctorId: {
          not: null,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      _count: true,
      orderBy: {
        _count: {
          doctorId: "desc",
        },
      },
      take: 5,
    });

    const doctorsWithDetails = await Promise.all(
      topDoctors.map(async (item) => {
        if (!item.doctorId) return null;
        const doctor = await prisma.doctor.findUnique({
          where: { id: item.doctorId },
          select: {
            id: true,
            fullName: true,
            specialization: true,
          },
        });
        return {
          doctor,
          count: item._count.doctorId,
        };
      })
    );

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
          bySource: appointmentsBySource.map((item) => ({
            source: item.source,
            count: item._count,
          })),
          dailyTrend: dailyAppointments,
        },
        patients: {
          total: totalPatients,
        },
        conversations: {
          total: totalConversations,
          messages: messagesCount,
        },
        topDoctors: doctorsWithDetails.filter((d): d is NonNullable<typeof d> => d !== null),
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

