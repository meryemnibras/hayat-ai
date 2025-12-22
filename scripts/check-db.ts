#!/usr/bin/env tsx
/**
 * Script to check database connection and schema
 * Usage: tsx scripts/check-db.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log("🔍 Checking Database Connection...\n");

  try {
    // 1. Test connection
    console.log("1️⃣ Testing database connection...");
    await prisma.$connect();
    console.log("   ✅ Database connection successful\n");

    // 2. Check if tables exist
    console.log("2️⃣ Checking database tables...");
    
    const tables = {
      Clinic: await prisma.clinic.count().catch(() => null),
      User: await prisma.user.count().catch(() => null),
      Patient: await prisma.patient.count().catch(() => null),
      Doctor: await prisma.doctor.count().catch(() => null),
      Appointment: await prisma.appointment.count().catch(() => null),
      Conversation: await prisma.conversation.count().catch(() => null),
      Message: await prisma.message.count().catch(() => null),
      Subscription: await prisma.subscription.count().catch(() => null),
    };

    let allTablesExist = true;
    for (const [table, count] of Object.entries(tables)) {
      if (count === null) {
        console.log(`   ❌ ${table}: Table not found or error`);
        allTablesExist = false;
      } else {
        console.log(`   ✅ ${table}: ${count} records`);
      }
    }

    if (!allTablesExist) {
      console.log("\n⚠️  Some tables are missing. Run migration:");
      console.log("   npx prisma migrate dev");
      process.exit(1);
    }

    console.log("\n3️⃣ Checking relationships...");
    
    // Test a relationship query
    try {
      const clinicWithRelations = await prisma.clinic.findFirst({
        include: {
          doctors: true,
          patients: true,
          appointments: true,
        },
      });
      console.log("   ✅ Relationships working correctly");
    } catch (error: any) {
      console.log(`   ⚠️  Relationship test failed: ${error.message}`);
    }

    // 4. Check indexes (indirectly by testing queries)
    console.log("\n4️⃣ Testing queries...");
    
    try {
      await prisma.appointment.findMany({
        where: { status: "SCHEDULED" },
        take: 1,
      });
      console.log("   ✅ Queries working correctly");
    } catch (error: any) {
      console.log(`   ⚠️  Query test failed: ${error.message}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Database is properly configured and connected!");
    console.log("=".repeat(50));

  } catch (error: any) {
    console.error("\n❌ Database check failed:");
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes("Can't reach database server")) {
      console.error("\n💡 Possible solutions:");
      console.error("   1. Check DATABASE_URL in .env.local");
      console.error("   2. Verify database server is running");
      console.error("   3. Check network/firewall settings");
    } else if (error.message.includes("does not exist")) {
      console.error("\n💡 Possible solutions:");
      console.error("   1. Run migration: npx prisma migrate dev");
      console.error("   2. Check schema.prisma is correct");
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

