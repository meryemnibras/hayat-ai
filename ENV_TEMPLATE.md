# 📝 قالب Environment Variables

انسخ هذا الملف إلى `.env` واملأ القيم:

```env
# ═══════════════════════════════════════
# Database (مطلوب)
# ═══════════════════════════════════════
DATABASE_URL="postgresql://user:password@localhost:5432/hayat_ai?schema=public"

# ═══════════════════════════════════════
# OpenAI Configuration (مطلوب)
# ═══════════════════════════════════════
OPENAI_API_KEY=sk-proj-YOUR-OPENAI-API-KEY-HERE
OPENAI_MODEL=gpt-4-turbo-preview
TEMPERATURE=0.7
MAX_TOKENS=2000

# ═══════════════════════════════════════
# Application URLs
# ═══════════════════════════════════════
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Hayat Beauty Clinic

# ═══════════════════════════════════════
# Contact Info
# ═══════════════════════════════════════
NEXT_PUBLIC_WHATSAPP_NUMBER=00905362266054
NEXT_PUBLIC_PHONE_NUMBER=00905362266054
NEXT_PUBLIC_EMAIL=info@mediai.tr

# ═══════════════════════════════════════
# Default Clinic ID
# ═══════════════════════════════════════
DEFAULT_CLINIC_ID=default-clinic-id

# ═══════════════════════════════════════
# Clerk Authentication (اختياري)
# ═══════════════════════════════════════
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_KEY
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET

# ═══════════════════════════════════════
# Stripe Configuration (اختياري)
# ═══════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ═══════════════════════════════════════
# Twilio WhatsApp (اختياري)
# ═══════════════════════════════════════
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_DEFAULT_CLINIC_ID=default-clinic-id

# ═══════════════════════════════════════
# Analytics (اختياري)
# ═══════════════════════════════════════
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token-here
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```



