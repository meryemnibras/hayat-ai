import twilio from "twilio";

let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (twilioClient) return twilioClient;
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    return null;
  }
  
  try {
    twilioClient = twilio(accountSid, authToken);
    return twilioClient;
  } catch (error) {
    console.warn("[WhatsApp] Failed to initialize Twilio client:", error);
    return null;
  }
}

const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // format: whatsapp:+123456789

export async function sendWhatsAppMessage(to: string, body: string) {
  const client = getTwilioClient();
  if (!client || !fromNumber) {
    throw new Error("Twilio WhatsApp client is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM environment variables.");
  }
  const normalizedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  return client.messages.create({
    from: fromNumber,
    to: normalizedTo,
    body,
  });
}



