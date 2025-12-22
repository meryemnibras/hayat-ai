import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password } = body;

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      // Fallback to mock response if Clerk is not configured
      console.warn("[Register] Clerk not configured, using mock response");
      return NextResponse.json(
        {
          message: "Registration successful (mock - Clerk not configured)",
          user: {
            email,
            fullName,
          },
        },
        { status: 201 }
      );
    }

    try {
      // Check if user already exists
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [email],
        limit: 1,
      });

      if (existingUsers.data.length > 0) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }

      // Create user in Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        password,
        firstName: fullName.split(" ")[0] || fullName,
        lastName: fullName.split(" ").slice(1).join(" ") || "",
        phoneNumber: phone ? [phone] : undefined,
        skipPasswordChecks: false,
      });

      // Create user in database
      const dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: email,
          fullName: fullName,
          phone: phone,
          clinicId: process.env.DEFAULT_CLINIC_ID || "",
          role: "STAFF",
        },
      });

      return NextResponse.json({
        message: "Registration successful",
        user: {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
        },
      });
    } catch (clerkError: any) {
      console.error("[Register] Clerk error:", clerkError);

      // Handle specific Clerk errors
      if (clerkError?.errors?.[0]?.message?.includes("already exists") || 
          clerkError?.errors?.[0]?.code === "duplicate_record") {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Registration failed. Please try again." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[Register] Error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}




