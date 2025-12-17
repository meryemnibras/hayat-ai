import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/portal/doctors - Get available doctors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const specialty = searchParams.get("specialty");

    // Try to fetch from database
    const doctors = await prisma.user.findMany({
      where: {
        role: "DOCTOR",
        ...(clinicId && { clinicId }),
      },
      include: {
        clinic: true,
      },
    });

    if (doctors.length > 0) {
      return NextResponse.json({
        doctors: doctors.map((doctor) => ({
          id: doctor.id,
          name: {
            en: doctor.fullName,
            ar: doctor.fullName,
            tr: doctor.fullName,
            fr: doctor.fullName,
          },
          specialty: {
            en: doctor.title || "Specialist",
            ar: doctor.title || "متخصص",
            tr: doctor.title || "Uzman",
            fr: doctor.title || "Spécialiste",
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
          bio: `Experienced ${doctor.title || "specialist"} at ${doctor.clinic?.name || "Hayat Clinic"}`,
        })),
      });
    }

    // Return demo data if no doctors in database
    return NextResponse.json({
      doctors: [
        {
          id: 1,
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
        {
          id: 2,
          name: {
            en: "Dr. Ahmed Hassan",
            ar: "د. أحمد حسن",
            tr: "Dr. Ahmed Hassan",
            fr: "Dr. Ahmed Hassan",
          },
          specialty: {
            en: "Plastic Surgery",
            ar: "الجراحة التجميلية",
            tr: "Plastik Cerrahi",
            fr: "Chirurgie Plastique",
          },
          experience: 20,
          rating: 4.8,
          reviews: 189,
          image: "https://i.pravatar.cc/150?img=3",
          languages: ["AR", "EN", "TR"],
          availableSlots: ["10:00", "11:00", "14:00", "15:00"],
          nextAvailable: "Tomorrow",
          price: "$200",
          badges: ["Expert", "Verified"],
          bio: "Board certified plastic surgeon with focus on reconstructive and aesthetic procedures.",
        },
        {
          id: 3,
          name: {
            en: "Dr. Marie Dubois",
            ar: "د. ماري دوبوا",
            tr: "Dr. Marie Dubois",
            fr: "Dr. Marie Dubois",
          },
          specialty: {
            en: "Hair Transplant",
            ar: "زراعة الشعر",
            tr: "Saç Ekimi",
            fr: "Greffe de Cheveux",
          },
          experience: 12,
          rating: 4.9,
          reviews: 312,
          image: "https://i.pravatar.cc/150?img=5",
          languages: ["FR", "EN", "AR"],
          availableSlots: ["09:00", "11:00", "13:00", "15:00", "17:00"],
          nextAvailable: "Today",
          price: "$180",
          badges: ["Popular", "5 Star"],
          bio: "Leading expert in FUE hair transplant with over 3000 successful procedures.",
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);

    // Return demo data on error
    return NextResponse.json({
      doctors: [
        {
          id: 1,
          name: { en: "Dr. Sarah Johnson", ar: "د. سارة جونسون", tr: "Dr. Sarah Johnson", fr: "Dr. Sarah Johnson" },
          specialty: { en: "Dermatology", ar: "الأمراض الجلدية", tr: "Dermatoloji", fr: "Dermatologie" },
          experience: 15,
          rating: 4.9,
          reviews: 234,
          image: "https://i.pravatar.cc/150?img=1",
          languages: ["EN", "AR"],
          availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
          nextAvailable: "Today",
          price: "$150",
          badges: ["Top Rated"],
          bio: "Specialized in cosmetic dermatology.",
        },
      ],
    });
  }
}



