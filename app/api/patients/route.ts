import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/patients - Get all patients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const gender = searchParams.get("gender");
    const preferredLanguage = searchParams.get("preferredLanguage");

    const where: any = {};
    if (clinicId) {
      where.clinicId = clinicId;
    }
    if (gender) {
      where.gender = gender;
    }
    if (preferredLanguage) {
      where.preferredLanguage = preferredLanguage;
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        clinic: {
          select: {
            name: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      patients: patients.map((patient) => ({
        id: patient.id,
        clinicId: patient.clinicId,
        clinic: patient.clinic,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        medicalHistorySummary: patient.medicalHistorySummary,
        allergies: patient.allergies,
        preferredLanguage: patient.preferredLanguage,
        notes: patient.notes,
        tags: patient.tags,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      })),
      count: patients.length,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clinicId,
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      medicalHistorySummary,
      allergies,
      preferredLanguage,
      notes,
      tags,
    } = body;

    if (!clinicId || !fullName) {
      return NextResponse.json(
        { success: false, error: "clinicId and fullName are required" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        clinicId,
        fullName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        emergencyContactName,
        emergencyContactPhone,
        medicalHistorySummary,
        allergies,
        preferredLanguage,
        notes,
        tags: tags || [],
      },
      include: {
        clinic: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      patient,
    });
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create patient" },
      { status: 500 }
    );
  }
}

