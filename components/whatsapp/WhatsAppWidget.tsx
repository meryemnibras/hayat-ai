'use client'

import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { analytics } from '@/lib/analytics'

interface WhatsAppWidgetProps {
  phoneNumber: string
  message?: string
  position?: 'left' | 'right'
}

export function WhatsAppWidget({ 
  phoneNumber, 
  message = 'مرحباً، أود الاستفسار عن خدماتكم',
  position = 'left'
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    analytics.track('whatsapp_widget_opened', { source: 'widget' })
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  return (
    <div 
      className={`fixed bottom-6 z-50 ${position === 'left' ? 'left-6' : 'right-6'}`}
      style={{ direction: 'ltr' }}
    >
      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/50"
        aria-label="تواصل معنا على WhatsApp"
      >
        {/* Pulse Animation */}
        <div className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
        
        {/* WhatsApp Icon */}
        <MessageCircle className="h-7 w-7 text-white" fill="currentColor" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
          تواصل معنا على WhatsApp
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
        </div>
      </button>

      {/* Optional: Chat Bubble (can be toggled) */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-80 rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E]">
                <MessageCircle className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">عيادة حياة</p>
                <p className="text-xs text-gray-500">متصل الآن</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700">
              مرحباً! كيف يمكننا مساعدتك اليوم؟
            </p>
            <button
              onClick={handleClick}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              ابدأ المحادثة
            </button>
          </div>
        </div>
      )}
    </div>
  )
}




