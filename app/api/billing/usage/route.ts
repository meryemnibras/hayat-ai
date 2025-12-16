import { NextRequest, NextResponse } from "next/server";
import { getUsageStatus, getUsageAlerts } from "@/lib/billing/usage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");

    if (!clinicId) {
      return NextResponse.json(
        { error: "clinicId is required" },
        { status: 400 }
      );
    }

    const [status, alerts] = await Promise.all([
      getUsageStatus(clinicId),
      getUsageAlerts(clinicId),
    ]);

    return NextResponse.json({ status, alerts });
  } catch (error) {
    console.error("Usage status error:", error);
    return NextResponse.json(
      { error: "Failed to get usage status" },
      { status: 500 }
    );
  }
}

