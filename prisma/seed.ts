import { PrismaClient, Gender } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Specializations for doctors
const specializations = [
  "Dermatoloji",
  "Plastik Cerrahi",
  "Estetik Cerrahi",
  "Saç Ekimi",
  "Ortodonti",
  "Göz Hastalıkları",
  "Kulak Burun Boğaz",
  "Genel Cerrahi",
  "Kardiyoloji",
  "Nöroloji",
  "Ortopedi",
  "Üroloji",
  "Jinekoloji",
  "Onkoloji",
  "Fizik Tedavi",
];

// Languages
const languages = ["TR", "EN", "AR", "FR", "DE", "RU"];

// Turkish cities
const cities = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Gaziantep",
  "Konya",
  "Kayseri",
  "Eskişehir",
];

// Generate Turkish phone number
function generateTurkishPhone(): string {
  const areaCodes = ["212", "216", "232", "312", "232", "242", "322", "342", "332", "352"];
  const areaCode = faker.helpers.arrayElement(areaCodes);
  const number = faker.string.numeric(7);
  return `+90${areaCode}${number}`;
}

// Generate availability schedule
function generateAvailabilitySchedule(): any {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const schedule: any = {};

  days.forEach((day) => {
    if (Math.random() > 0.2) {
      // 80% chance of working on this day
      const startHour = faker.helpers.arrayElement([8, 9, 10]);
      const endHour = startHour + faker.number.int({ min: 6, max: 8 });
      schedule[day] = [`${startHour.toString().padStart(2, "0")}:00-${endHour.toString().padStart(2, "0")}:00`];
    }
  });

  return schedule;
}

// Generate doctors
async function seedDoctors() {
  console.log("🌱 Seeding doctors...");

  const doctors = [];

  for (let i = 0; i < 15; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `Dr. ${firstName} ${lastName}`;
    const specialization = faker.helpers.arrayElement(specializations);
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const phoneNumber = generateTurkishPhone();
    const licenseNumber = `TUR-${faker.string.alphanumeric(8).toUpperCase()}`;
    const yearsExperience = faker.number.int({ min: 2, max: 30 });
    const hospitalAffiliation = faker.helpers.arrayElement([
      "Hayat AI Clinic",
      "İstanbul Estetik Merkezi",
      "Ankara Tıp Merkezi",
      "Medipol Üniversitesi Hastanesi",
      "Acıbadem Hastanesi",
      null,
    ]);
    const availabilitySchedule = generateAvailabilitySchedule();
    const languagesSpoken = faker.helpers.arrayElements(languages, { min: 1, max: 4 });

    doctors.push({
      fullName,
      specialization,
      email,
      phoneNumber,
      licenseNumber,
      yearsExperience,
      hospitalAffiliation,
      availabilitySchedule,
      languagesSpoken,
    });
  }

  await prisma.doctor.createMany({
    data: doctors,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${doctors.length} doctors`);
}

// Generate patients
async function seedPatients(clinicId: string) {
  console.log("🌱 Seeding patients...");

  const patients = [];
  const genders: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.UNSPECIFIED];
  const preferredLanguages = ["TR", "EN", "AR", "FR"];

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const gender = faker.helpers.arrayElement(genders);
    const dateOfBirth = faker.date.birthdate({ min: 18, max: 80, mode: "age" });
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const phone = generateTurkishPhone();
    const city = faker.helpers.arrayElement(cities);
    const address = `${faker.location.streetAddress()}, ${city}, Türkiye`;
    const emergencyContactName = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const emergencyContactPhone = generateTurkishPhone();
    const medicalHistorySummary = faker.helpers.maybe(
      () =>
        faker.helpers.arrayElement([
          "Hipertansiyon öyküsü",
          "Diyabet tip 2",
          "Alerjik rinit",
          "Migren",
          "Hiçbir önemli hastalık öyküsü yok",
          "Geçirilmiş apandisit ameliyatı",
          "Astım",
        ]),
      { probability: 0.7 }
    );
    const allergies = faker.helpers.maybe(
      () =>
        faker.helpers.arrayElement([
          "Penisilin",
          "Lateks",
          "Polen",
          "Toz",
          "Fıstık",
          "Yok",
          "Bilinmiyor",
        ]),
      { probability: 0.6 }
    );
    const preferredLanguage = faker.helpers.arrayElement(preferredLanguages);

    patients.push({
      clinicId,
      fullName,
      gender,
      dateOfBirth,
      email,
      phone,
      address,
      emergencyContactName,
      emergencyContactPhone,
      medicalHistorySummary,
      allergies,
      preferredLanguage,
    });
  }

  await prisma.patient.createMany({
    data: patients,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${patients.length} patients`);
}

async function main() {
  console.log("🚀 Starting database seeding...\n");

  try {
    // Get or create a default clinic
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "hayat-ai-clinic" },
    });

    if (!clinic) {
      clinic = await prisma.clinic.create({
        data: {
          name: "Hayat AI Clinic",
          slug: "hayat-ai-clinic",
          phone: "+902125550123",
          email: "info@hayatai.tr",
          city: "İstanbul",
          country: "Türkiye",
          addressLine1: "Levent Mahallesi, Büyükdere Caddesi",
          timezone: "Europe/Istanbul",
        },
      });
      console.log("✅ Created default clinic");
    } else {
      console.log("✅ Using existing clinic");
    }

    // Seed doctors
    await seedDoctors();

    // Seed patients
    await seedPatients(clinic.id);

    console.log("\n✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

