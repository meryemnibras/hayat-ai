import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/patients - Get all patients (using User model with PATIENT role)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role") || "PATIENT";

    const where: any = {
      role: role as any,
    };
    
    if (userId) {
      where.id = userId;
    }

    const patients = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      patients: patients.map((patient) => ({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        role: patient.role,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      })),
      count: patients.length,
    });
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch patients",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "name and email are required" },
        { status: 400 }
      );
    }

    const patient = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: "PATIENT",
      },
    });

    return NextResponse.json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        role: patient.role,
      },
    });
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create patient",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
