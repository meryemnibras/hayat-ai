import twilio from "twilio";
import type { Twilio } from "twilio";

let twilioClient: Twilio | null = null;

function getTwilioClient(): Twilio | null {
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn(
      "[WhatsApp] Missing TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN"
    );
    return null;
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
}

export async function sendWhatsAppMessage(to: string, body: string) {
  const client = getTwilioClient();
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

  if (!client || !fromNumber) {
    throw new Error("Twilio WhatsApp client is not configured.");
  }

  const normalizedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  return client.messages.create({
    from: fromNumber,
    to: normalizedTo,
    body,
  });
}

export { getTwilioClient as twilioClient };
