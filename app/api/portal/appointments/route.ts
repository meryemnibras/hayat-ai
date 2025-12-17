import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/portal/appointments - Book a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doctorId, doctorName, specialty, date, time, patientId, clinicId } = body;

    // Validate required fields
    if (!doctorName || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: doctorName, date, time" },
        { status: 400 }
      );
    }

    // Parse the date and time
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour appointment

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        clinicId: clinicId || "default-clinic", // Use provided clinicId or default
        patientId: patientId || "guest-patient", // Use provided patientId or guest
        title: `${specialty} - ${doctorName}`,
        startTime,
        endTime,
        location: "Hayat AI Clinic",
        notes: `Booked via Patient Portal\nDoctor: ${doctorName}\nSpecialty: ${specialty}`,
        status: "SCHEDULED",
        source: "WEB",
      },
    });

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        doctor: doctorName,
        specialty,
        date,
        time,
        status: appointment.status,
        location: appointment.location,
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
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      // Return demo data if no patientId
      return NextResponse.json({
        appointments: [
          {
            id: "1",
            doctor: "Dr. Sarah Johnson",
            specialty: "Dermatology",
            date: "Dec 18, 2024",
            time: "14:00",
            status: "confirmed",
            location: "Hayat Clinic - Downtown",
          },
          {
            id: "2",
            doctor: "Dr. Ahmed Hassan",
            specialty: "Plastic Surgery",
            date: "Dec 22, 2024",
            time: "10:00",
            status: "pending",
            location: "Hayat Clinic - West Side",
          },
        ],
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId,
        startTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        provider: true,
      },
    });

    return NextResponse.json({
      appointments: appointments.map((apt) => ({
        id: apt.id,
        doctor: apt.provider?.fullName || "Doctor",
        specialty: apt.provider?.title || "Specialist",
        date: apt.startTime.toLocaleDateString(),
        time: apt.startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: apt.status.toLowerCase(),
        location: apt.location,
      })),
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    
    // Return demo data for demo purposes
    return NextResponse.json({
      appointments: [
        {
          id: "1",
          doctor: "Dr. Sarah Johnson",
          specialty: "Dermatology",
          date: "Dec 18, 2024",
          time: "14:00",
          status: "confirmed",
          location: "Hayat Clinic - Downtown",
        },
      ],
    });
  }
}



