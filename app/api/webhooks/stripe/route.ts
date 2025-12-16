import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/billing/stripe";
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

  // Retrieve subscription details
  const subscriptionResponse = await getStripe().subscriptions.retrieve(subscriptionId);
  const subscription = subscriptionResponse as unknown as SubscriptionWithPeriod;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  // Create or update subscription record
  await prisma.subscription.upsert({
    where: { clinicId },
    create: {
      clinicId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      tier,
      status: mapSubscriptionStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialEndsAt: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      tier,
      status: mapSubscriptionStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialEndsAt: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
  });

  console.log(`Subscription created for clinic ${clinicId}`);
}

async function handleSubscriptionUpdated(subscriptionEvent: Stripe.Subscription) {
  const subscription = subscriptionEvent as unknown as SubscriptionWithPeriod;
  const clinicId = subscription.metadata?.clinicId;
  if (!clinicId) {
    // Try to find by stripeSubscriptionId
    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });
    if (!existing) {
      console.error("Cannot find clinic for subscription", subscription.id);
      return;
    }
  }

  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      stripePriceId: priceId,
      tier,
      status: mapSubscriptionStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription ${subscription.id} updated`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      cancelAtPeriodEnd: false,
    },
  });

  console.log(`Subscription ${subscription.id} canceled`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const invoiceData = invoice as unknown as { subscription?: string | { id: string } };
  const subscriptionId = typeof invoiceData.subscription === 'string' 
    ? invoiceData.subscription 
    : invoiceData.subscription?.id;
  if (!subscriptionId) return;

  // Reset usage for new billing period
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (sub) {
    console.log(`Invoice paid for subscription ${subscriptionId}`);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData = invoice as unknown as { subscription?: string | { id: string } };
  const subscriptionId = typeof invoiceData.subscription === 'string' 
    ? invoiceData.subscription 
    : invoiceData.subscription?.id;
  if (!subscriptionId) return;

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "PAST_DUE" },
  });

  console.log(`Payment failed for subscription ${subscriptionId}`);
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
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
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
