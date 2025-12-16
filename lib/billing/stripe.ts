import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: "2025-11-17.clover",
    typescript: true,
  });

  return stripeClient;
}

export const stripe = {
  get client() {
    return getStripe();
  },
};

export async function createCheckoutSession({
  clinicId,
  clinicEmail,
  priceId,
  successUrl,
  cancelUrl,
}: {
  clinicId: string;
  clinicEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: clinicEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { clinicId },
    subscription_data: {
      metadata: { clinicId },
      trial_period_days: 14,
    },
  });
  return session;
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd = true
): Promise<Stripe.Subscription> {
  if (cancelAtPeriodEnd) {
    return getStripe().subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
  return getStripe().subscriptions.cancel(subscriptionId);
}

export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return getStripe().subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

export { getStripe };
