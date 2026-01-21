import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const query = searchParams.get("q");
    const type = searchParams.get("type"); // "appointments", "users", "all"

    if (!query) {
      return NextResponse.json(
        { error: "q (query) is required" },
        { status: 400 }
      );
    }

    const searchTerm = query.toLowerCase();
    const results: {
      appointments?: unknown[];
      users?: unknown[];
    } = {};

    // Search appointments
    if (!type || type === "appointments" || type === "all") {
      const appointments = await prisma.appointment.findMany({
        where: {
          ...(userId && { userId }),
          OR: [
            { doctorName: { contains: searchTerm, mode: "insensitive" } },
            { treatment: { contains: searchTerm, mode: "insensitive" } },
            { notes: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        take: 20,
        orderBy: {
          date: "desc",
        },
      });
      results.appointments = appointments;
    }

    // Search users
    if (!type || type === "users" || type === "all") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { phone: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        take: 20,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
      results.users = users;
    }

    return NextResponse.json({
      success: true,
      query: searchTerm,
      results,
      counts: {
        appointments: (results.appointments?.length || 0),
        users: (results.users?.length || 0),
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
