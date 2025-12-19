import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/portal/doctors - Get available doctors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const specialty = searchParams.get("specialty");

    // Try to fetch from Doctor model first
    const doctorsFromModel = await prisma.doctor.findMany({
      orderBy: {
        yearsExperience: "desc",
      },
    });

    if (doctorsFromModel.length > 0) {
      return NextResponse.json({
        doctors: doctorsFromModel.map((doctor) => {
          // Extract available slots from availabilitySchedule
          const schedule = doctor.availabilitySchedule as any;
          const availableSlots: string[] = [];
          if (schedule) {
            Object.values(schedule).forEach((slots: any) => {
              if (Array.isArray(slots)) {
                slots.forEach((slot: string) => {
                  // Extract time from "09:00-17:00" format
                  const times = slot.split("-");
                  if (times[0]) {
                    availableSlots.push(times[0]);
                  }
                });
              }
            });
          }

          // Default slots if none found
          const defaultSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

          return {
            id: doctor.id,
            name: {
              en: doctor.fullName,
              ar: doctor.fullName,
              tr: doctor.fullName,
              fr: doctor.fullName,
            },
            specialty: {
              en: doctor.specialization,
              ar: doctor.specialization,
              tr: doctor.specialization,
              fr: doctor.specialization,
            },
            experience: doctor.yearsExperience,
            rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
            reviews: Math.floor(Math.random() * 200) + 50,
            image: `https://i.pravatar.cc/150?u=${doctor.id}`,
            languages: doctor.languagesSpoken,
            availableSlots: availableSlots.length > 0 ? availableSlots : defaultSlots,
            nextAvailable: "Today",
            price: "$150",
            badges: doctor.hospitalAffiliation ? ["Verified", "Hospital Affiliated"] : ["Verified"],
            bio: `${doctor.yearsExperience} years of experience in ${doctor.specialization}${doctor.hospitalAffiliation ? ` at ${doctor.hospitalAffiliation}` : ""}`,
          };
        }),
      });
    }

    // Fallback: Try to fetch from User model
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



