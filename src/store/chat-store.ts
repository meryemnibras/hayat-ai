import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// توليد ID فريد (مستنسخ من utils لتجنب مشاكل المسار)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatState {
  // الحالة
  messages: Message[]
  isLoading: boolean
  error: string | null
  
  // الإجراءات
  addMessage: (role: 'user' | 'assistant', content: string) => void
  updateLastMessage: (content: string) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // إرسال رسالة للـ AI
  sendMessage: (content: string) => Promise<void>
  sendMessageStreaming: (content: string) => Promise<void>
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // الحالة الافتراضية
      messages: [],
      isLoading: false,
      error: null,

      // إضافة رسالة
      addMessage: (role, content) => {
        const newMessage: Message = {
          id: generateId(),
          role,
          content,
          timestamp: new Date(),
        }
        
        set((state) => ({
          messages: [...state.messages, newMessage],
        }))
      },

      // تحديث آخر رسالة (للـ streaming)
      updateLastMessage: (content) => {
        set((state) => {
          const messages = [...state.messages]
          const lastMessage = messages[messages.length - 1]
          
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = content
          }
          
          return { messages }
        })
      },

      // مسح المحادثة
      clearMessages: () => {
        set({ messages: [], error: null })
      },

      // تعيين حالة التحميل
      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // تعيين الخطأ
      setError: (error) => {
        set({ error })
      },

      // إرسال رسالة عادية (بدون streaming)
      sendMessage: async (content) => {
        const { addMessage, setLoading, setError } = get()

        try {
          setLoading(true)
          setError(null)

          // إضافة رسالة المستخدم
          addMessage('user', content)

          // إرسال للـ API
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: get().messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            }),
          })

          if (!response.ok) {
            throw new Error('فشل في الحصول على رد')
          }

          const data = await response.json()

          // إضافة رد AI
          addMessage('assistant', data.message.content)
        } catch (error: any) {
          console.error('❌ خطأ في إرسال الرسالة:', error)
          setError(error.message || 'حدث خطأ غير متوقع')
        } finally {
          setLoading(false)
        }
      },

      // إرسال رسالة مع streaming
      sendMessageStreaming: async (content) => {
        const { addMessage, updateLastMessage, setLoading, setError } = get()

        try {
          setLoading(true)
          setError(null)

          // إضافة رسالة المستخدم
          addMessage('user', content)

          // إضافة رسالة فارغة للـ AI
          addMessage('assistant', '')

          // إرسال للـ API Streaming
          const response = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: get().messages
                .filter(m => m.content) // تجاهل الرسالة الفارغة
                .map((m) => ({
                  role: m.role,
                  content: m.content,
                })),
            }),
          })

          if (!response.ok) {
            throw new Error('فشل في الحصول على رد')
          }

          // قراءة الـ stream
          const reader = response.body?.getReader()
          const decoder = new TextDecoder()
          let accumulatedContent = ''

          if (!reader) {
            throw new Error('لا يمكن قراءة الرد')
          }

          while (true) {
            const { done, value } = await reader.read()
            
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                
                if (data === '[DONE]') {
                  break
                }

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.content) {
                    accumulatedContent += parsed.content
                    updateLastMessage(accumulatedContent)
                  }
                } catch (e) {
                  // تجاهل أخطاء التحليل
                }
              }
            }
          }
        } catch (error: any) {
          console.error('❌ خطأ في Streaming:', error)
          setError(error.message || 'حدث خطأ غير متوقع')
          
          // حذف الرسالة الفارغة
          set((state) => ({
            messages: state.messages.filter(m => m.content),
          }))
        } finally {
          setLoading(false)
        }
      },
    }),
    {
      name: 'hayat-chat-storage',
      // حفظ المحادثات في localStorage
      partialize: (state) => ({
        messages: state.messages,
      }),
    }
  )
)

