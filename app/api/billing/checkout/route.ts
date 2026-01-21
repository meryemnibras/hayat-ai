import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/billing/stripe";
import { PLANS, PlanTier } from "@/lib/billing/plans";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clinicId, tier } = body as { clinicId: string; tier: PlanTier };

    if (!clinicId || !tier) {
      return NextResponse.json(
        { error: "clinicId and tier are required" },
        { status: 400 }
      );
    }

    const plan = PLANS[tier];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan tier" }, { status: 400 });
    }

    if (!plan.priceId) {
      return NextResponse.json(
        { error: "Plan price not configured" },
        { status: 500 }
      );
    }

    // Get user email (using userId as clinicId for now)
    const user = await prisma.user.findUnique({
      where: { id: clinicId },
      select: { email: true },
    });

    const clinicEmail = user?.email || process.env.NEXT_PUBLIC_EMAIL || "info@mediai.tr";

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      clinicId,
      clinicEmail,
      priceId: plan.priceId,
      successUrl: `${baseUrl}/dashboard/settings/billing?success=true`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

