import { NextRequest } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'
import { ENHANCED_SYSTEM_PROMPT } from '@/src/lib/langchain-enhanced'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const chatModel = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.MAX_TOKENS || '2000'),
  streaming: true,
})

export const runtime = 'edge'

/**
 * POST /api/chat/stream
 * الردود المتدفقة (Streaming)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response('الرسائل مطلوبة', { status: 400 })
    }

    // تحويل الرسائل
    const langChainMessages = [
      new SystemMessage(ENHANCED_SYSTEM_PROMPT),
      ...messages.map((msg: any) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
    ]

    // إنشاء Streaming Response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamResponse = await chatModel.stream(langChainMessages)

          for await (const chunk of streamResponse) {
            if (chunk.content) {
              const text = chunk.content as string
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
              )
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('❌ خطأ في Streaming:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('❌ خطأ في API Streaming:', error)
    return new Response(error.message, { status: 500 })
  }
}








