import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ENHANCED_SYSTEM_PROMPT } from './langchain-enhanced'

// تحميل متغيرات البيئة
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
const TEMPERATURE = parseFloat(process.env.TEMPERATURE || '0.7')
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '2000')

if (!OPENAI_API_KEY) {
  throw new Error('❌ OPENAI_API_KEY غير موجود في .env')
}

/**
 * تهيئة نموذج GPT-4
 */
export const chatModel = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  modelName: OPENAI_MODEL,
  temperature: TEMPERATURE,
  maxTokens: MAX_TOKENS,
  streaming: true, // لدعم الردود المتدفقة
})

/**
 * دالة لإرسال رسالة والحصول على رد
 */
export async function sendMessage(userMessage: string): Promise<string> {
  try {
    const messages = [
      new SystemMessage(ENHANCED_SYSTEM_PROMPT),
      new HumanMessage(userMessage)
    ]
    
    const response = await chatModel.invoke(messages)
    return response.content as string
  } catch (error) {
    console.error('❌ خطأ في AI:', error)
    throw error
  }
}

/**
 * دالة لإرسال محادثة متعددة الأدوار
 */
export async function sendConversation(
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    const messages = [
      new SystemMessage(ENHANCED_SYSTEM_PROMPT),
      ...conversationHistory.map(msg => 
        msg.role === 'user' 
          ? new HumanMessage(msg.content)
          : new SystemMessage(msg.content) // رد المساعد يصبح system message
      )
    ]
    
    const response = await chatModel.invoke(messages)
    return response.content as string
  } catch (error) {
    console.error('❌ خطأ في AI:', error)
    throw error
  }
}

/**
 * دالة للردود المتدفقة (Streaming)
 */
export async function* streamMessage(userMessage: string) {
  const messages = [
    new SystemMessage(ENHANCED_SYSTEM_PROMPT),
    new HumanMessage(userMessage)
  ]
  
  const stream = await chatModel.stream(messages)
  
  for await (const chunk of stream) {
    if (chunk.content) {
      yield chunk.content
    }
  }
}

console.log('✅ نظام AI جاهز!')
console.log(`📦 النموذج: ${OPENAI_MODEL}`)
console.log(`🌡️ Temperature: ${TEMPERATURE}`)
console.log(`📝 Max Tokens: ${MAX_TOKENS}`)













