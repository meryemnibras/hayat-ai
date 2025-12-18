import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // format: whatsapp:+123456789

if (!accountSid || !authToken || !fromNumber) {
  console.warn(
    "[WhatsApp] Missing TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_WHATSAPP_FROM",
  );
}

export const twilioClient =
  accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppMessage(to: string, body: string) {
  if (!twilioClient || !fromNumber) {
    throw new Error("Twilio WhatsApp client is not configured.");
  }
  const normalizedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  return twilioClient.messages.create({
    from: fromNumber,
    to: normalizedTo,
    body,
  });
}



