import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement Doctor model in Prisma schema
    // For now, return empty array
    return NextResponse.json({
      success: true,
      doctors: [],
      count: 0,
      message: "Doctor model not yet implemented in Prisma schema",
    });
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch doctors",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement Doctor model in Prisma schema
    return NextResponse.json(
      {
        success: false,
        error: "Doctor model not yet implemented in Prisma schema",
      },
      { status: 501 }
    );
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create doctor",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
