'use client'

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Paperclip, Mic, X } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "اكتب رسالتك هنا..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // تعديل ارتفاع textarea تلقائياً
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      
      // إعادة ضبط الارتفاع
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // إرسال عند Ctrl+Enter أو Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-white p-4">
      <div
        className={cn(
          'flex items-end gap-2 rounded-2xl border-2 bg-gray-50 px-4 py-3 transition-all',
          isFocused ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {/* زر المرفقات (مستقبلي) */}
        <button
          type="button"
          disabled={disabled}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          title="إرفاق ملف (قريباً)"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* حقل الإدخال */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-gray-900',
            'placeholder:text-gray-400 focus:outline-none',
            'max-h-32 overflow-y-auto',
            'disabled:cursor-not-allowed'
          )}
          style={{ direction: 'rtl' }}
        />

        {/* أزرار الإرسال والصوت */}
        <div className="flex items-center gap-2">
          {message.trim() ? (
            <button
              type="button"
              onClick={handleSend}
              disabled={disabled}
              className={cn(
                'rounded-full p-2 transition-all',
                'bg-pink-500 text-white hover:bg-pink-600',
                'disabled:bg-gray-300 disabled:cursor-not-allowed',
                'active:scale-95'
              )}
              title="إرسال (Ctrl+Enter)"
            >
              <Send className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
              title="تسجيل صوتي (قريباً)"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* نصيحة صغيرة */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        اضغط <kbd className="px-2 py-0.5 bg-gray-200 rounded text-xs">Ctrl</kbd> + 
        <kbd className="px-2 py-0.5 bg-gray-200 rounded text-xs mx-1">Enter</kbd> 
        للإرسال
      </p>
    </div>
  )
}









