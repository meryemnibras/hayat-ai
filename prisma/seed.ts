// @ts-nocheck
// This seed file is for a different schema version
// It's disabled during build but can be updated later if needed

import { PrismaClient, UserRole, AppointmentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Generate Turkish phone number
function generateTurkishPhone(): string {
  const areaCodes = ["212", "216", "232", "312", "232", "242", "322", "342", "332", "352"];
  const areaCode = faker.helpers.arrayElement(areaCodes);
  const number = faker.string.numeric(7);
  return `+90${areaCode}${number}`;
}

// Generate sample users (patients and doctors)
async function seedUsers() {
  console.log("🌱 Seeding users...");

  const users = [];

  // Create 10 patients
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const phone = generateTurkishPhone();

    users.push({
      name,
      email,
      phone,
      role: UserRole.PATIENT,
    });
  }

  // Create 5 doctors
  for (let i = 0; i < 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `Dr. ${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const phone = generateTurkishPhone();

    users.push({
      name,
      email,
      phone,
      role: UserRole.DOCTOR,
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${users.length} users`);
}

// Generate sample appointments
async function seedAppointments() {
  console.log("🌱 Seeding appointments...");

  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("⚠️ No users found, skipping appointments");
    return;
  }

  const appointments = [];
  const treatments = [
    "Dermatoloji Konsültasyonu",
    "Plastik Cerrahi",
    "Estetik Cerrahi",
    "Saç Ekimi",
    "Ortodonti",
    "Göz Muayenesi",
  ];

  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    const doctorName = `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`;
    const treatment = faker.helpers.arrayElement(treatments);
    const date = faker.date.future();
    const time = `${faker.number.int({ min: 9, max: 17 })}:00`;
    const status = faker.helpers.arrayElement([
      AppointmentStatus.PENDING,
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.COMPLETED,
    ]);

    appointments.push({
      userId: user.id,
      doctorName,
      treatment,
      date,
      time,
      status,
    });
  }

  await prisma.appointment.createMany({
    data: appointments,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${appointments.length} appointments`);
}

async function main() {
  console.log("🚀 Starting database seeding...\n");

  try {
    // Seed users
    await seedUsers();

    // Seed appointments
    await seedAppointments();

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

