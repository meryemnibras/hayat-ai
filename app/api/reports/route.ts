import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const reportType = searchParams.get("type") || "appointments"; // "appointments", "users"
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    switch (reportType) {
      case "appointments": {
        const appointments = await prisma.appointment.findMany({
          where: {
            ...(userId && { userId }),
            date: {
              gte: start,
              lte: end,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: {
            date: "asc",
          },
        });

        return NextResponse.json({
          success: true,
          report: {
            type: "appointments",
            period: { start, end },
            data: appointments,
            summary: {
              total: appointments.length,
              byStatus: appointments.reduce((acc, apt) => {
                acc[apt.status] = (acc[apt.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>),
            },
          },
        });
      }

      case "users": {
        const users = await prisma.user.findMany({
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          include: {
            appointments: {
              select: {
                id: true,
                date: true,
                status: true,
              },
            },
          },
        });

        return NextResponse.json({
          success: true,
          report: {
            type: "users",
            period: { start, end },
            data: users,
            summary: {
              total: users.length,
              withAppointments: users.filter((u) => u.appointments.length > 0).length,
            },
          },
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid report type. Use 'appointments' or 'users'" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
