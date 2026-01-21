'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChatHeader } from '@/src/components/chat/ChatHeader'
import { ChatMessage } from '@/src/components/chat/ChatMessage'
import { ChatInput } from '@/src/components/chat/ChatInput'
import { QuickActions } from '@/src/components/chat/QuickActions'
import { useChatStore } from '@/src/store/chat-store'
import { Analytics } from '@/src/lib/analytics'
import { Loader2, Sparkles } from 'lucide-react'

export default function HomePage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const sessionStartTime = useRef<number>(Date.now())
  
  const { 
    messages, 
    isLoading, 
    error,
    sendMessageStreaming,
    clearMessages 
  } = useChatStore()

  // تتبع بدء الجلسة
  useEffect(() => {
    Analytics.chatStarted()

    // تتبع مدة الجلسة عند المغادرة
    return () => {
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000)
      Analytics.sessionDuration(duration)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false)
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    setShowWelcome(false)
    
    // تتبع الرسالة
    const isFirstMessage = messages.length === 0
    Analytics.messageSent(content.length, isFirstMessage)
    
    // تتبع استفسارات الأسعار
    if (content.includes('سعر') || content.includes('تكلفة') || content.includes('كم')) {
      const treatments = ['شعر', 'أنف', 'أسنان', 'شفط', 'فيلر', 'بوتوكس']
      const foundTreatment = treatments.find(t => content.includes(t))
      if (foundTreatment) {
        Analytics.priceInquiry(foundTreatment)
      }
    }
    
    await sendMessageStreaming(content)
  }

  const handleQuickAction = async (message: string) => {
    // تتبع النقر على السؤال السريع
    Analytics.quickActionClicked(message.substring(0, 30))
    await handleSendMessage(message)
  }

  const handleClearChat = () => {
    if (confirm('هل تريد مسح المحادثة؟ سيتم حذف جميع الرسائل.')) {
      Analytics.chatCleared()
      clearMessages()
      setShowWelcome(true)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 via-teal-50 to-navy-50">
      {/* Header */}
      <ChatHeader 
        onClose={handleClearChat}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* رسالة الترحيب */}
          {showWelcome && messages.length === 0 && (
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* بطاقة الترحيب الرئيسية */}
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-primary-100">
                <div className="text-center mb-6">
                  {/* أيقونة متحركة */}
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-full mb-4 shadow-glow-green animate-pulse-slow">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  
                  {/* العنوان */}
                  <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
                    مرحباً بك في عيادة حياة للتجميل
                  </h1>
                  
                  {/* الوصف */}
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    أنا <span className="font-bold text-primary-600">حياة</span>، مساعدتك الذكية المدعومة بالذكاء الاصطناعي. 
                    هنا لمساعدتك في كل ما تحتاجه! 🌟
                  </p>
                </div>

                {/* مميزات العيادة */}
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="group card hover:shadow-glow-green">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-navy-900 mb-1 text-base">
                          استشارات فورية
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          احصل على إجابات فورية ودقيقة لجميع استفساراتك الطبية والتجميلية
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group card hover:shadow-glow-navy">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-200 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-navy-900 mb-1 text-base">
                          حجز المواعيد
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          احجز موعدك بسهولة وسرعة مع أفضل الأطباء المتخصصين
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group card hover:shadow-glow-green">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-navy-100 to-navy-200 rounded-xl group-hover:scale-110 transition-transform">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-navy-900 mb-1 text-base">
                          الأسعار والعروض
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          أسعار شفافة وعروض خاصة حصرية لمرضانا الكرام
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* شريط الإحصائيات */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="group cursor-pointer">
                      <div className="text-3xl font-bold text-gradient-primary group-hover:scale-110 transition-transform">
                        5000+
                      </div>
                      <div className="text-sm text-gray-600 mt-1">عملية ناجحة</div>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="text-3xl font-bold text-gradient-primary group-hover:scale-110 transition-transform">
                        98%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">رضا المرضى</div>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="text-3xl font-bold text-gradient-primary group-hover:scale-110 transition-transform">
                        18+
                      </div>
                      <div className="text-sm text-gray-600 mt-1">سنة خبرة</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* الإجراءات السريعة */}
              <QuickActions 
                onSelectAction={handleQuickAction}
                disabled={isLoading}
              />
            </div>
          )}

          {/* الرسائل */}
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={
                isLoading && 
                index === messages.length - 1 && 
                message.role === 'assistant'
              }
            />
          ))}

          {/* مؤشر التحميل */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-primary-200 mr-8 mb-4 shadow-lg animate-in slide-in-from-bottom-2">
              <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow-green">
                <span className="text-white font-bold text-lg">حـ</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                <span className="text-gray-700 font-medium">حياة تكتب الرد...</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* رسالة الخطأ */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4 animate-in slide-in-from-top">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-800 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-primary-100 bg-white/90 backdrop-blur-md shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="اكتب سؤالك هنا... (مثال: كم سعر زراعة الشعر؟)"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-primary py-3 text-center">
        <p className="text-white text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            مدعوم بالذكاء الاصطناعي
          </span>
          <span className="mx-2">•</span>
          <span>عيادة حياة للتجميل - إسطنبول، تركيا 🇹🇷</span>
        </p>
      </div>
    </div>
  )
}
