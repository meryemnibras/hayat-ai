import { NextResponse } from "next/server";
import { validateRequest } from "twilio";
import { getHayatAgent } from "@/lib/ai/agents/HayatAgent";
import { sendWhatsAppMessage } from "@/lib/whatsapp/client";
import { prisma } from "@/lib/prisma";

type WebhookPayload = {
  rawBody: string;
  params: URLSearchParams;
  signature: string | null;
  url: string;
};

type Job = { payload: WebhookPayload; attempts: number };

const queue: Job[] = [];
let processing = false;
const MAX_ATTEMPTS = 3;

function enqueue(payload: WebhookPayload) {
  queue.push({ payload, attempts: 0 });
  void processQueue();
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processQueue() {
  if (processing) return;
  processing = true;
  while (queue.length > 0) {
    const job = queue[0];
    try {
      await handleMessage(job.payload);
      queue.shift();
    } catch (err) {
      job.attempts += 1;
      console.error("[WhatsApp] Job failed attempt", job.attempts, err);
      if (job.attempts >= MAX_ATTEMPTS) {
        queue.shift();
      } else {
        await delay(500 * job.attempts);
      }
    }
  }
  processing = false;
}

function verifySignature(payload: WebhookPayload) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    throw new Error("TWILIO_AUTH_TOKEN is not set");
  }
  const paramsObj: Record<string, string> = {};
  payload.params.forEach((value, key) => {
    paramsObj[key] = value;
  });

  return validateRequest(
    authToken,
    payload.signature ?? "",
    payload.url,
    paramsObj,
  );
}

async function handleMessage(payload: WebhookPayload) {
  if (!verifySignature(payload)) {
    throw new Error("Invalid Twilio signature");
  }

  const from = payload.params.get("From") ?? "";
  const waId = payload.params.get("WaId") ?? from.replace("whatsapp:", "");
  const body = payload.params.get("Body")?.trim();

  if (!body) {
    console.warn("[WhatsApp] Empty body received");
    return;
  }

  // Find or create user by phone number
  let user =
    (await prisma.user.findFirst({
      where: { phone: waId },
    })) ??
    (await prisma.user.create({
      data: {
        phone: waId,
        name: `WhatsApp User ${waId}`,
        role: "PATIENT",
      },
    }));

  // Find or create conversation
  let conversation =
    (await prisma.conversation.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: "desc" },
    })) ??
    (await prisma.conversation.create({
      data: {
        userId: user.id,
      },
    }));

  // Save user message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: body,
    },
  });

  // Get AI response
  const agent = getHayatAgent();
  const aiResult = await agent.chat({ 
    message: body, 
    patientId: user.id,
  });

  // Save AI message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "ASSISTANT",
      content: aiResult.reply as string,
    },
  });

  // Send WhatsApp response
  await sendWhatsAppMessage(from, aiResult.reply as string);
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    const signature = req.headers.get("x-twilio-signature");
    const url = new URL(req.url);

    enqueue({ rawBody, params, signature, url: url.toString() });

    return NextResponse.json({ status: "queued" });
  } catch (error) {
    console.error("[WhatsApp] webhook error", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
