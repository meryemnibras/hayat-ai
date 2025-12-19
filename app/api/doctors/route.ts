import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/doctors - Get all doctors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get("specialization");
    const language = searchParams.get("language");

    const where: any = {};
    if (specialization) {
      where.specialization = specialization;
    }
    if (language) {
      where.languagesSpoken = {
        has: language,
      };
    }

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: {
        yearsExperience: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      doctors: doctors.map((doctor) => ({
        id: doctor.id,
        fullName: doctor.fullName,
        specialization: doctor.specialization,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        licenseNumber: doctor.licenseNumber,
        yearsExperience: doctor.yearsExperience,
        hospitalAffiliation: doctor.hospitalAffiliation,
        availabilitySchedule: doctor.availabilitySchedule,
        languagesSpoken: doctor.languagesSpoken,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      })),
      count: doctors.length,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

// POST /api/doctors - Create a new doctor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      specialization,
      email,
      phoneNumber,
      licenseNumber,
      yearsExperience,
      hospitalAffiliation,
      availabilitySchedule,
      languagesSpoken,
    } = body;

    if (!fullName || !specialization || !email || !phoneNumber || !licenseNumber || !yearsExperience) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        fullName,
        specialization,
        email,
        phoneNumber,
        licenseNumber,
        yearsExperience,
        hospitalAffiliation,
        availabilitySchedule,
        languagesSpoken: languagesSpoken || [],
      },
    });

    return NextResponse.json({
      success: true,
      doctor,
    });
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create doctor" },
      { status: 500 }
    );
  }
}

