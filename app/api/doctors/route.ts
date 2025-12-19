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

    // Check if Doctor model exists by trying to query it
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
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    
    // Check if it's a Prisma error about missing table
    if (error?.code === "P2021" || error?.message?.includes("does not exist") || error?.message?.includes("Unknown model")) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Doctor table does not exist. Please run migrations first.",
          solution: "Run: npx prisma migrate dev --name add_doctor_patient_models",
          details: error.message,
          code: error.code
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
          code: error.code
        },
        { status: 500 }
      );
    }
    
    // Check if Prisma Client is not generated
    if (error?.message?.includes("prisma.doctor") || error?.message?.includes("Unknown model")) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Prisma Client is not up to date. Please regenerate it.",
          solution: "Run: npx prisma generate",
          details: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch doctors",
        details: error?.message || String(error),
        code: error?.code || "UNKNOWN"
      },
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
