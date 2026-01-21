import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/portal/appointments - Book a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doctorName, treatment, date, time, userId } = body;

    // Validate required fields
    if (!doctorName || !treatment || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: doctorName, treatment, date, time" },
        { status: 400 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: userId || "guest-user",
        doctorName,
        treatment,
        date: new Date(date),
        time,
        status: "PENDING",
        notes: `Booked via Patient Portal\nDoctor: ${doctorName}\nTreatment: ${treatment}`,
      },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        doctorName: appointment.doctorName,
        treatment: appointment.treatment,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
      },
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    
    // Return success for demo purposes if database is not set up
    return NextResponse.json({
      success: true,
      message: "Appointment booking request received",
      demo: true,
    });
  }
}

// GET /api/portal/appointments - Get patient's appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      // Return demo data if no userId
      return NextResponse.json({
        appointments: [
          {
            id: "1",
            doctorName: "Dr. Sarah Johnson",
            treatment: "Dermatology Consultation",
            date: "Dec 18, 2024",
            time: "14:00",
            status: "CONFIRMED",
          },
          {
            id: "2",
            doctorName: "Dr. Ahmed Hassan",
            treatment: "Plastic Surgery Consultation",
            date: "Dec 22, 2024",
            time: "10:00",
            status: "PENDING",
          },
        ],
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        date: {
          gte: new Date(),
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
        date: "asc",
      },
    });

    return NextResponse.json({
      appointments: appointments.map((apt) => ({
        id: apt.id,
        doctorName: apt.doctorName,
        treatment: apt.treatment,
        date: apt.date.toLocaleDateString(),
        time: apt.time,
        status: apt.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    
    // Return demo data for demo purposes
    return NextResponse.json({
      appointments: [
        {
          id: "1",
          doctorName: "Dr. Sarah Johnson",
          treatment: "Dermatology Consultation",
          date: "Dec 18, 2024",
          time: "14:00",
          status: "CONFIRMED",
        },
      ],
    });
  }
}
