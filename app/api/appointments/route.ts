import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const patientId = searchParams.get("patientId");
    const providerId = searchParams.get("providerId");
    const doctorId = searchParams.get("doctorId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};
    if (clinicId) {
      where.clinicId = clinicId;
    }
    if (patientId) {
      where.patientId = patientId;
    }
    if (providerId) {
      where.providerId = providerId;
    }
    if (doctorId) {
      where.doctorId = doctorId;
    }
    if (status) {
      where.status = status;
    }
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        where.startTime.gte = new Date(startDate);
      }
      if (endDate) {
        where.startTime.lte = new Date(endDate);
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
            title: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            email: true,
            phoneNumber: true,
          },
        },
        clinic: {
          select: {
            id: true,
            name: true,
            addressLine1: true,
            city: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        clinicId: appointment.clinicId,
        clinic: appointment.clinic,
        patientId: appointment.patientId,
        patient: appointment.patient,
        providerId: appointment.providerId,
        provider: appointment.provider,
        doctorId: appointment.doctorId,
        doctor: appointment.doctor,
        status: appointment.status,
        source: appointment.source,
        title: appointment.title,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        location: appointment.location,
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
      clinicId,
      patientId,
      providerId,
      doctorId,
      status,
      source,
      title,
      startTime,
      endTime,
      location,
      notes,
    } = body;

    if (!clinicId || !patientId || !startTime) {
      return NextResponse.json(
        { success: false, error: "clinicId, patientId, and startTime are required" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        clinicId,
        patientId,
        providerId,
        doctorId,
        status: status || "SCHEDULED",
        source: source || "WEB",
        title,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : undefined,
        location,
        notes,
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
        provider: {
          select: {
            id: true,
            fullName: true,
            title: true,
          },
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            email: true,
            phoneNumber: true,
          },
        },
        clinic: {
          select: {
            id: true,
            name: true,
            addressLine1: true,
            city: true,
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




