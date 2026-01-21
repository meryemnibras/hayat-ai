import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/billing/stripe";
import { prisma } from "@/lib/prisma";
import { PlanTier } from "@/lib/billing/plans";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe subscription with period timestamps
interface SubscriptionWithPeriod {
  id: string;
  status: Stripe.Subscription.Status;
  current_period_start: number;
  current_period_end: number;
  trial_end: number | null;
  cancel_at_period_end: boolean;
  metadata?: { clinicId?: string };
  items: {
    data: Array<{ price: { id: string } }>;
  };
}

// Map Stripe price IDs to plan tiers
function getTierFromPriceId(priceId: string): PlanTier {
  if (priceId === process.env.STRIPE_ESSENTIAL_PRICE_ID) return "ESSENTIAL";
  if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) return "PROFESSIONAL";
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return "PREMIUM";
  return "ESSENTIAL"; // Default
}

// Map Stripe subscription status to our status
function mapSubscriptionStatus(
  status: Stripe.Subscription.Status
): "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID" {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "incomplete_expired":
      return "CANCELED";
    case "unpaid":
    case "incomplete":
      return "UNPAID";
    default:
      return "ACTIVE";
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const clinicId = session.metadata?.clinicId;
  if (!clinicId) {
    console.error("No clinicId in session metadata");
    return;
  }

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  // TODO: Implement subscription model in Prisma schema
  console.log(`✅ Checkout completed for clinic ${clinicId}, subscription ${subscriptionId}, customer ${customerId}`);
  console.log("⚠️ Subscription model not yet implemented in Prisma schema");
}

async function handleSubscriptionUpdated(subscriptionEvent: Stripe.Subscription) {
  const subscription = subscriptionEvent as unknown as SubscriptionWithPeriod;
  const clinicId = subscription.metadata?.clinicId;
  
  // TODO: Implement subscription model in Prisma schema
  console.log(`✅ Subscription updated: ${subscription.id} for clinic ${clinicId || 'unknown'}`);
  console.log("⚠️ Subscription model not yet implemented in Prisma schema");
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // TODO: Implement subscription model in Prisma schema
  console.log(`✅ Subscription deleted: ${subscription.id}`);
  console.log("⚠️ Subscription model not yet implemented in Prisma schema");
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const invoiceData = invoice as unknown as { subscription?: string | { id: string } };
  const subscriptionId = typeof invoiceData.subscription === 'string' 
    ? invoiceData.subscription 
    : invoiceData.subscription?.id;
  if (!subscriptionId) return;

  // TODO: Implement subscription model in Prisma schema
  console.log(`✅ Invoice paid for subscription ${subscriptionId}`);
  console.log("⚠️ Subscription model not yet implemented in Prisma schema");
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData = invoice as unknown as { subscription?: string | { id: string } };
  const subscriptionId = typeof invoiceData.subscription === 'string' 
    ? invoiceData.subscription 
    : invoiceData.subscription?.id;
  if (!subscriptionId) return;

  // TODO: Implement subscription model in Prisma schema
  console.log(`❌ Payment failed for subscription ${subscriptionId}`);
  console.log("⚠️ Subscription model not yet implemented in Prisma schema");
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
