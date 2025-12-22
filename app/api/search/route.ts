import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const query = searchParams.get("q");
    const type = searchParams.get("type"); // "patients", "appointments", "doctors", "all"

    if (!clinicId || !query) {
      return NextResponse.json(
        { error: "clinicId and q (query) are required" },
        { status: 400 }
      );
    }

    const searchTerm = query.toLowerCase();
    const results: {
      patients?: unknown[];
      appointments?: unknown[];
      doctors?: unknown[];
    } = {};

    // Search patients
    if (!type || type === "patients" || type === "all") {
      const patients = await prisma.patient.findMany({
        where: {
          clinicId,
          OR: [
            { fullName: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { phone: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 20,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      });
      results.patients = patients;
    }

    // Search appointments
    if (!type || type === "appointments" || type === "all") {
      const appointments = await prisma.appointment.findMany({
        where: {
          clinicId,
          OR: [
            {
              patient: {
                fullName: { contains: searchTerm, mode: "insensitive" },
              },
            },
            {
              doctor: {
                fullName: { contains: searchTerm, mode: "insensitive" },
              },
            },
            {
              title: { contains: searchTerm, mode: "insensitive" },
            },
          ],
        },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
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
        take: 20,
        orderBy: {
          startTime: "desc",
        },
      });
      results.appointments = appointments;
    }

    // Search doctors
    if (!type || type === "doctors" || type === "all") {
      const doctors = await prisma.doctor.findMany({
        where: {
          OR: [
            { fullName: { contains: searchTerm, mode: "insensitive" } },
            { specialization: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 20,
        select: {
          id: true,
          fullName: true,
          specialization: true,
          email: true,
          yearsExperience: true,
        },
      });
      results.doctors = doctors;
    }

    return NextResponse.json({
      success: true,
      query: searchTerm,
      results,
      counts: {
        patients: (results.patients?.length || 0),
        appointments: (results.appointments?.length || 0),
        doctors: (results.doctors?.length || 0),
      },
    });
  } catch (error: any) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

