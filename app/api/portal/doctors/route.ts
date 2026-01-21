import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/portal/doctors - Get available doctors
export async function GET(request: NextRequest) {
  try {
    // Try to fetch from User model with DOCTOR role
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
      },
    });

    if (doctors.length > 0) {
      return NextResponse.json({
        doctors: doctors.map((doctor) => ({
          id: doctor.id,
          name: {
            en: doctor.name || "Doctor",
            ar: doctor.name || "طبيب",
            tr: doctor.name || "Doktor",
            fr: doctor.name || "Docteur",
          },
          specialty: {
            en: "Specialist",
            ar: "متخصص",
            tr: "Uzman",
            fr: "Spécialiste",
          },
          experience: 10,
          rating: 4.8,
          reviews: 100,
          image: `https://i.pravatar.cc/150?u=${doctor.id}`,
          languages: ["EN", "AR"],
          availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          nextAvailable: "Today",
          price: "$150",
          badges: ["Verified"],
          bio: `Experienced specialist at Hayat Clinic`,
        })),
      });
    }

    // Return demo data if no doctors in database
    return NextResponse.json({
      doctors: [
        {
          id: "1",
          name: {
            en: "Dr. Sarah Johnson",
            ar: "د. سارة جونسون",
            tr: "Dr. Sarah Johnson",
            fr: "Dr. Sarah Johnson",
          },
          specialty: {
            en: "Dermatology",
            ar: "الأمراض الجلدية",
            tr: "Dermatoloji",
            fr: "Dermatologie",
          },
          experience: 15,
          rating: 4.9,
          reviews: 234,
          image: "https://i.pravatar.cc/150?img=1",
          languages: ["EN", "AR"],
          availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
          nextAvailable: "Today",
          price: "$150",
          badges: ["Top Rated", "Quick Response"],
          bio: "Specialized in cosmetic dermatology with extensive experience in laser treatments.",
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
