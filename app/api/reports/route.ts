import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const reportType = searchParams.get("type"); // "financial", "appointments", "patients", "performance"
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!clinicId) {
      return NextResponse.json(
        { error: "clinicId is required" },
        { status: 400 }
      );
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    switch (reportType) {
      case "appointments": {
        const appointments = await prisma.appointment.findMany({
          where: {
            clinicId,
            startTime: {
              gte: start,
              lte: end,
            },
          },
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
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
          orderBy: {
            startTime: "asc",
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

      case "patients": {
        const patients = await prisma.patient.findMany({
          where: {
            clinicId,
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          include: {
            appointments: {
              select: {
                id: true,
                startTime: true,
                status: true,
              },
            },
          },
        });

        return NextResponse.json({
          success: true,
          report: {
            type: "patients",
            period: { start, end },
            data: patients,
            summary: {
              total: patients.length,
              withAppointments: patients.filter((p) => p.appointments.length > 0).length,
            },
          },
        });
      }

      case "performance": {
        const appointments = await prisma.appointment.findMany({
          where: {
            clinicId,
            startTime: {
              gte: start,
              lte: end,
            },
          },
          include: {
            doctor: {
              select: {
                fullName: true,
                specialization: true,
              },
            },
          },
        });

        const doctorPerformance = appointments.reduce((acc, apt) => {
          if (!apt.doctor) return acc;
          const doctorId = apt.doctor.id;
          if (!acc[doctorId]) {
            acc[doctorId] = {
              doctor: apt.doctor,
              total: 0,
              completed: 0,
              cancelled: 0,
            };
          }
          acc[doctorId].total++;
          if (apt.status === "COMPLETED") acc[doctorId].completed++;
          if (apt.status === "CANCELLED") acc[doctorId].cancelled++;
          return acc;
        }, {} as Record<string, any>);

        return NextResponse.json({
          success: true,
          report: {
            type: "performance",
            period: { start, end },
            data: Object.values(doctorPerformance),
            summary: {
              totalAppointments: appointments.length,
              completionRate: appointments.filter((a) => a.status === "COMPLETED").length / appointments.length,
            },
          },
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
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

