#!/usr/bin/env tsx
/**
 * Script to check if all required environment variables are set
 * Usage: tsx scripts/check-env.ts
 */

const requiredVars = {
  // Critical
  DATABASE_URL: "PostgreSQL database connection string (REQUIRED)",
  DEFAULT_CLINIC_ID: "Default clinic ID for the application",
  
  // Clerk (optional but recommended)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "Clerk publishable key (optional)",
  CLERK_SECRET_KEY: "Clerk secret key (optional)",
  
  // OpenAI (for AI features)
  OPENAI_API_KEY: "OpenAI API key for AI agent",
  
  // Twilio (for WhatsApp)
  TWILIO_ACCOUNT_SID: "Twilio account SID (optional)",
  TWILIO_AUTH_TOKEN: "Twilio auth token (optional)",
  TWILIO_WHATSAPP_FROM: "Twilio WhatsApp from number (optional)",
};

const optionalVars = {
  EMAIL_SERVICE: "Email service provider",
  SENDGRID_API_KEY: "SendGrid API key",
  RESEND_API_KEY: "Resend API key",
  NEXT_PUBLIC_WS_URL: "WebSocket URL for real-time",
  STRIPE_SECRET_KEY: "Stripe secret key",
};

function checkEnv() {
  console.log("🔍 Checking Environment Variables...\n");
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Check required variables
  console.log("📋 Required Variables:");
  for (const [key, description] of Object.entries(requiredVars)) {
    const value = process.env[key];
    if (value) {
      const masked = key.includes("KEY") || key.includes("SECRET") || key.includes("TOKEN")
        ? `${value.substring(0, 8)}...`
        : value;
      console.log(`  ✅ ${key}: ${masked}`);
    } else {
      if (key.includes("CLERK") || key.includes("TWILIO")) {
        console.log(`  ⚠️  ${key}: Not set (optional but recommended)`);
        console.log(`     Description: ${description}`);
        hasWarnings = true;
      } else if (key === "DATABASE_URL") {
        console.log(`  ❌ ${key}: Missing! (CRITICAL)`);
        console.log(`     Description: ${description}`);
        console.log(`     💡 Run: npm run db:migrate after setting DATABASE_URL`);
        hasErrors = true;
      } else {
        console.log(`  ❌ ${key}: Missing!`);
        console.log(`     Description: ${description}`);
        hasErrors = true;
      }
    }
  }
  
  console.log("\n📋 Optional Variables:");
  for (const [key, description] of Object.entries(optionalVars)) {
    const value = process.env[key];
    if (value) {
      const masked = key.includes("KEY") || key.includes("SECRET")
        ? `${value.substring(0, 8)}...`
        : value;
      console.log(`  ✅ ${key}: ${masked}`);
    } else {
      console.log(`  ⚪ ${key}: Not set (optional)`);
    }
  }
  
  console.log("\n" + "=".repeat(50));
  
  if (hasErrors) {
    console.log("❌ Some required environment variables are missing!");
    console.log("   Please check .env.local or Vercel Environment Variables");
    console.log("   📚 See ENV_SETUP_COMPLETE.md for setup instructions");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("⚠️  Some recommended environment variables are missing.");
    console.log("   The app will work but some features may be limited.");
    console.log("   📚 See ENV_SETUP_COMPLETE.md for setup instructions");
    process.exit(0);
  } else {
    console.log("✅ All required environment variables are set!");
    console.log("   🎉 Your environment is properly configured!");
    process.exit(0);
  }
}

checkEnv();

