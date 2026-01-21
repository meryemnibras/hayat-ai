import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// ═══════════════════════════════════════
// أسعار العلاجات (بالسنت)
// ═══════════════════════════════════════

export const TREATMENT_PRICES = {
  // زراعة الشعر
  hairTransplant: {
    basic: 180000, // $1,800
    gold: 250000,  // $2,500
    platinum: 350000, // $3,500
  },
  
  // تجميل الأنف
  rhinoplasty: {
    open: 450000,     // $4,500
    closed: 375000,   // $3,750
    nonSurgical: 85000, // $850
  },
  
  // ابتسامة هوليوود
  hollywoodSmile: {
    basic: 400000,  // $4,000
    premium: 650000, // $6,500
  },
  
  // شفط الدهون
  liposuction: {
    oneArea: 200000,   // $2,000
    twoAreas: 380000,  // $3,800
    threeAreas: 550000, // $5,500
  },
  
  // استشارة
  consultation: {
    free: 0,
    detailed: 5000, // $50
  },
} as const

// ═══════════════════════════════════════
// دالة إنشاء جلسة دفع
// ═══════════════════════════════════════

export async function createCheckoutSession({
  treatmentName,
  price,
  successUrl,
  cancelUrl,
  customerEmail,
  metadata,
}: {
  treatmentName: string
  price: number
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: treatmentName,
            description: `عيادة حياة للتجميل - ${treatmentName}`,
            images: ['https://your-domain.com/logo.png'],
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      treatment: treatmentName,
      ...metadata,
    },
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    // locale: 'ar', // Stripe doesn't support Arabic locale, will use default
  })

  return session
}

// ═══════════════════════════════════════
// دالة إنشاء نية دفع (للدفع المباشر)
// ═══════════════════════════════════════

export async function createPaymentIntent({
  amount,
  currency = 'usd',
  metadata,
}: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

// ═══════════════════════════════════════
// التحقق من Webhook
// ═══════════════════════════════════════

export async function constructEventFromPayload(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  )
}










