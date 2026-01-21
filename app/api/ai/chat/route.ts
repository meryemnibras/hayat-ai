import { NextResponse } from "next/server";
import { getHayatAgent } from "@/lib/ai/agents/HayatAgent";
import { MemoryManager } from "@/lib/ai/memory/MemoryManager";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string | undefined = body?.message;
    const patientId: string | undefined = body?.patientId;
    const conversationId: string | undefined = body?.conversationId;
    const clinicId: string | undefined = body?.clinicId || process.env.DEFAULT_CLINIC_ID;

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Get or create conversation ID if patientId is provided
    let finalConversationId = conversationId;
    if (!finalConversationId && patientId) {
      finalConversationId = await MemoryManager.getOrCreateConversation(
        patientId
      );
    }

    const agent = getHayatAgent();
    const result = await agent.chat({ 
      message, 
      patientId,
      conversationId: finalConversationId,
      clinicId,
    });

    return NextResponse.json({
      ...result,
      conversationId: finalConversationId,
    });
  } catch (error) {
    console.error("AI chat error", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}



