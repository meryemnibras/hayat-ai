import { NextResponse } from "next/server";
import { getHayatAgent } from "@/lib/ai/agents/HayatAgent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text: string | undefined = body?.text;

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const agent = getHayatAgent();
    const result = await agent.analyze(text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI analyze error", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 },
    );
  }
}



