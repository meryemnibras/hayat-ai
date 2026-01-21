import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
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
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        userId: appointment.userId,
        user: appointment.user,
        doctorName: appointment.doctorName,
        treatment: appointment.treatment,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })),
      count: appointments.length,
    });
  } catch (error: any) {
    console.error("Error fetching appointments:", error);

    // Check if it's a Prisma error about missing table
    if (error?.code === "P2021" || error?.message?.includes("does not exist") || error?.message?.includes("Unknown model")) {
      return NextResponse.json(
        {
          success: false,
          error: "Appointment table does not exist. Please run migrations first.",
          solution: "Run: npx prisma migrate dev",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Check if it's a connection error
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database") || error?.message?.includes("connection")) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot connect to database. Please check DATABASE_URL in .env file",
          solution: "Verify DATABASE_URL is set correctly in .env file",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch appointments",
        details: error?.message || String(error),
        code: error?.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      doctorName,
      treatment,
      date,
      time,
      status,
      notes,
    } = body;

    if (!userId || !doctorName || !treatment || !date || !time) {
      return NextResponse.json(
        { success: false, error: "userId, doctorName, treatment, date, and time are required" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorName,
        treatment,
        date: new Date(date),
        time,
        status: status || "PENDING",
        notes,
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
    });

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create appointment" },
      { status: 500 }
    );
  }
}
