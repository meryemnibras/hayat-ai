import { NextRequest, NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'
import { ENHANCED_SYSTEM_PROMPT } from '@/src/lib/langchain-enhanced'

// التحقق من وجود API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY غير موجود في .env')
}

// تهيئة النموذج
const chatModel = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.MAX_TOKENS || '2000'),
  streaming: true,
})

export const runtime = 'edge' // استخدام Edge Runtime للسرعة

/**
 * POST /api/chat
 * إرسال رسالة والحصول على رد من AI
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'الرسائل مطلوبة' },
        { status: 400 }
      )
    }

    // تحويل الرسائل لصيغة LangChain
    const langChainMessages = [
      new SystemMessage(ENHANCED_SYSTEM_PROMPT),
      ...messages.map((msg: any) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
    ]

    // الحصول على الرد
    const response = await chatModel.invoke(langChainMessages)

    return NextResponse.json({
      message: {
        role: 'assistant',
        content: response.content as string,
      },
    })
  } catch (error: any) {
    console.error('❌ خطأ في API:', error)
    
    return NextResponse.json(
      { 
        error: 'حدث خطأ في الخادم',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/chat
 * معلومات حول API
 */
/**
 * GET /api/chat
 * معلومات حول API
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Hayat AI Chat API',
    version: '1.0.0',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    timestamp: new Date().toISOString(),
  })
}

