// Analytics utility for tracking events
// Supports PostHog (recommended) or custom implementation

type EventProperties = Record<string, string | number | boolean | null>;

interface AnalyticsUser {
  id: string;
  email?: string;
  clinicId?: string;
  role?: string;
}

class Analytics {
  private enabled: boolean;
  private apiKey: string;
  private apiHost: string;

  constructor() {
    this.enabled = !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
    this.apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
    this.apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
  }

  // Identify user
  identify(user: AnalyticsUser) {
    if (!this.enabled) return;

    this.sendEvent("$identify", {
      $user_id: user.id,
      $set: {
        email: user.email,
        clinicId: user.clinicId,
        role: user.role,
      },
    });
  }

  // Track event
  track(event: string, properties?: EventProperties) {
    if (!this.enabled) return;

    this.sendEvent(event, properties);
  }

  // Track page view
  pageView(path: string, properties?: EventProperties) {
    this.track("$pageview", { $current_url: path, ...properties });
  }

  // Revenue tracking
  trackRevenue(amount: number, currency: string, properties?: EventProperties) {
    this.track("revenue", {
      $revenue: amount,
      currency,
      ...properties,
    });
  }

  // AI interaction tracking
  trackAIInteraction(properties: {
    clinicId: string;
    language: string;
    toolsUsed?: string[];
    responseTime?: number;
  }) {
    this.track("ai_interaction", properties);
  }

  // Appointment tracking
  trackAppointment(action: "booked" | "confirmed" | "completed" | "cancelled", properties: {
    clinicId: string;
    source?: string;
  }) {
    this.track(`appointment_${action}`, properties);
  }

  // Private: Send event to analytics backend
  private async sendEvent(event: string, properties?: EventProperties) {
    if (!this.enabled) return;

    try {
      await fetch(`${this.apiHost}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: this.apiKey,
          event,
          properties: {
            ...properties,
            $lib: "hayat-ai",
            $lib_version: "1.0.0",
          },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }
}

export const analytics = new Analytics();

// Predefined events for type safety
export const ANALYTICS_EVENTS = {
  // User events
  USER_SIGNED_UP: "user_signed_up",
  USER_SIGNED_IN: "user_signed_in",
  USER_SIGNED_OUT: "user_signed_out",

  // Subscription events
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_UPGRADED: "subscription_upgraded",
  SUBSCRIPTION_DOWNGRADED: "subscription_downgraded",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",

  // AI events
  AI_CHAT_STARTED: "ai_chat_started",
  AI_CHAT_COMPLETED: "ai_chat_completed",
  AI_TOOL_USED: "ai_tool_used",
  AI_ESCALATED: "ai_escalated",

  // Appointment events
  APPOINTMENT_BOOKED: "appointment_booked",
  APPOINTMENT_CONFIRMED: "appointment_confirmed",
  APPOINTMENT_COMPLETED: "appointment_completed",
  APPOINTMENT_CANCELLED: "appointment_cancelled",

  // WhatsApp events
  WHATSAPP_MESSAGE_RECEIVED: "whatsapp_message_received",
  WHATSAPP_MESSAGE_SENT: "whatsapp_message_sent",
} as const;

