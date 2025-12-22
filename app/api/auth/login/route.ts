import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      // Fallback to mock response if Clerk is not configured
      console.warn("[Login] Clerk not configured, using mock response");
      return NextResponse.json(
        {
          message: "Login successful (mock - Clerk not configured)",
          token: "mock_token_" + Date.now(),
          user: {
            email,
            fullName: "Mock User",
          },
        },
        { status: 200 }
      );
    }

    try {
      // Try to find user in Clerk by email
      const clerkUsers = await clerkClient.users.getUserList({
        emailAddress: [email],
        limit: 1,
      });

      if (clerkUsers.data.length === 0) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const clerkUser = clerkUsers.data[0];

      // Find or create user in database
      const dbUser = await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: {
          email: clerkUser.emailAddresses[0]?.emailAddress || email,
          fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email,
        },
        create: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || email,
          fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email,
          clinicId: process.env.DEFAULT_CLINIC_ID || "",
          role: "STAFF",
        },
      });

      return NextResponse.json({
        message: "Login successful",
        user: {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          role: dbUser.role,
        },
      });
    } catch (clerkError: any) {
      console.error("[Login] Clerk error:", clerkError);
      // If Clerk fails, return error
      return NextResponse.json(
        { error: "Authentication failed. Please check your credentials." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}




