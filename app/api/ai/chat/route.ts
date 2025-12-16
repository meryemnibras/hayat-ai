import { NextResponse } from "next/server";
import { getHayatAgent } from "@/lib/ai/agents/HayatAgent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string | undefined = body?.message;
    const patientId: string | undefined = body?.patientId;

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const agent = getHayatAgent();
    const result = await agent.chat({ message, patientId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI chat error", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}



