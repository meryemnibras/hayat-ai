'use client'

import React from 'react'
import { cn } from '@/src/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CheckCheck, Clock } from 'lucide-react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-2xl mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 transition-all',
        isUser 
          ? 'bg-gradient-to-br from-navy-50 to-navy-100 ml-12 border-2 border-navy-200 shadow-md hover:shadow-lg' 
          : 'bg-white mr-12 border-2 border-primary-100 shadow-md hover:shadow-lg'
      )}
    >
      {/* صورة المساعد */}
      {!isUser && (
        <Avatar className="h-12 w-12 shrink-0 ring-2 ring-primary-200 shadow-md">
          <AvatarImage src="/hayat-avatar.png" alt="حياة" />
          <AvatarFallback className="bg-gradient-primary text-white font-bold text-lg">
            حـ
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 space-y-2">
        {/* ترويسة الرسالة */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            'font-bold text-sm px-3 py-1 rounded-full',
            isUser 
              ? 'bg-navy-200 text-navy-900' 
              : 'bg-gradient-primary text-white shadow-sm'
          )}>
            {isUser ? 'أنت' : 'حياة - مساعدتك الذكية'}
          </span>
          
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {message.timestamp.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {/* مؤشر الكتابة */}
          {isStreaming && (
            <div className="flex items-center gap-1.5 bg-primary-50 px-2 py-1 rounded-full">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="text-xs text-primary-700 font-medium">يكتب...</span>
            </div>
          )}
          
          {/* علامة التسليم */}
          {isUser && !isStreaming && (
            <CheckCheck className="w-4 h-4 text-primary-600" />
          )}
        </div>
        
        {/* محتوى الرسالة */}
        <div className={cn(
          'prose prose-sm max-w-none',
          isUser ? 'text-navy-900' : 'text-gray-800'
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-base">
              {message.content}
            </p>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold mt-4 mb-2 text-navy-800 flex items-center gap-2" {...props}>
                    <span className="w-1 h-6 bg-gradient-primary rounded-full" />
                    {props.children}
                  </h3>
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-base font-bold mt-3 mb-2 text-navy-700" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-none space-y-2 my-3" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-none space-y-2 my-3 counter-reset" {...props} />
                ),
                li: ({ node, children, ...props }) => (
                  <li className="flex items-start gap-2 text-gray-700" {...props}>
                    <span className="text-primary-500 mt-1">✓</span>
                    <span className="flex-1">{children}</span>
                  </li>
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-3 leading-relaxed text-gray-800" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-navy-900 bg-primary-50 px-1 rounded" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="text-primary-700 font-medium" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a 
                    className="text-navy-600 hover:text-primary-600 underline decoration-2 decoration-primary-300 hover:decoration-primary-500 transition-colors font-medium" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    {...props} 
                  />
                ),
                code: ({ node, inline, ...props }: any) => 
                  inline ? (
                    <code className="bg-navy-50 text-navy-800 px-2 py-0.5 rounded font-mono text-sm border border-navy-200" {...props} />
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-xl my-4 overflow-x-auto font-mono text-sm" {...props} />
                  ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl my-4 overflow-x-auto" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-primary-500 bg-primary-50 pl-4 py-2 my-4 italic text-gray-700" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 rounded-xl border-2 border-primary-100 shadow-sm">
                    <table className="min-w-full" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-gradient-primary" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="px-4 py-3 text-right font-bold text-white border-b-2 border-primary-400" {...props} />
                ),
                tbody: ({ node, ...props }) => (
                  <tbody className="bg-white" {...props} />
                ),
                tr: ({ node, ...props }) => (
                  <tr className="hover:bg-primary-50 transition-colors" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200" {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-6 border-t-2 border-primary-200" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
      
      {/* صورة المستخدم */}
      {isUser && (
        <Avatar className="h-12 w-12 shrink-0 ring-2 ring-navy-300 shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-navy-500 to-navy-700 text-white text-xl">
            👤
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
