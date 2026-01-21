'use client'

import React from 'react'
import { 
  Phone, 
  Video, 
  MoreVertical, 
  X,
  ExternalLink,
  Info,
  Sparkles,
  Globe
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface ChatHeaderProps {
  onClose?: () => void
  onOpenInfo?: () => void
}

export function ChatHeader({ onClose, onOpenInfo }: ChatHeaderProps) {
  const whatsappNumber = '00905362266054'
  const phoneNumber = '00905362266054'

  const handleWhatsAppCall = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank')
  }

  const handlePhoneCall = () => {
    window.open(`tel:${phoneNumber}`)
  }

  return (
    <div className="relative overflow-hidden">
      {/* خلفية متدرجة */}
      <div className="absolute inset-0 bg-gradient-primary opacity-100" />
      
      {/* نمط خلفي ديكوري */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* معلومات حياة */}
          <div className="flex items-center gap-4">
            {/* صورة حياة */}
            <div className="relative">
              <Avatar className="h-14 w-14 border-3 border-white shadow-glow-green ring-4 ring-white/20">
                <AvatarImage src="/hayat-avatar.png" alt="حياة" />
                <AvatarFallback className="bg-white text-primary-600 font-bold text-xl">
                  حـ
                </AvatarFallback>
              </Avatar>
              {/* نقطة الاتصال */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse" />
            </div>
            
            <div>
              {/* الاسم */}
              <h2 className="font-bold text-xl text-white flex items-center gap-2">
                حياة
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </h2>
              
              {/* الحالة */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-glow-green" />
                  <span className="text-white font-medium">متاحة الآن</span>
                </div>
                <span className="text-white/80 text-xs">• ترد خلال ثوانٍ</span>
              </div>
              
              {/* معلومات إضافية */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Globe className="w-3 h-3" />
                  <span>إسطنبول، تركيا</span>
                </div>
              </div>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex items-center gap-2">
            {/* زر الاتصال الصوتي */}
            <button
              onClick={handlePhoneCall}
              className="group p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-110"
              title="اتصال صوتي"
            >
              <Phone className="h-5 w-5 text-white group-hover:animate-bounce" />
            </button>

            {/* زر واتساب */}
            <button
              onClick={handleWhatsAppCall}
              className="group p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-110"
              title="واتساب"
            >
              <svg 
                className="h-5 w-5 text-white group-hover:scale-110 transition-transform" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </button>

            {/* زر الفيديو (مستقبلي) */}
            <button
              className="group p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 opacity-50 cursor-not-allowed"
              title="مكالمة فيديو (قريباً)"
              disabled
            >
              <Video className="h-5 w-5 text-white" />
            </button>

            {/* القائمة المنسدلة */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group p-3 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-110">
                  <MoreVertical className="h-5 w-5 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-white border-2 border-primary-100 shadow-xl rounded-2xl p-2"
              >
                <DropdownMenuItem 
                  onClick={onOpenInfo}
                  className="rounded-xl cursor-pointer hover:bg-primary-50 transition-colors p-3"
                >
                  <Info className="ml-3 h-5 w-5 text-navy-600" />
                  <div>
                    <div className="font-semibold text-navy-900">معلومات العيادة</div>
                    <div className="text-xs text-gray-500">العنوان، أوقات العمل</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleWhatsAppCall}
                  className="rounded-xl cursor-pointer hover:bg-primary-50 transition-colors p-3"
                >
                  <ExternalLink className="ml-3 h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-navy-900">فتح في واتساب</div>
                    <div className="text-xs text-gray-500">محادثة مباشرة</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-2 bg-gray-200" />
                
                <DropdownMenuItem 
                  className="rounded-xl cursor-pointer hover:bg-red-50 text-red-600 transition-colors p-3"
                  onClick={() => {
                    if (confirm('هل تريد مسح المحادثة؟ سيتم حذف جميع الرسائل.')) {
                      window.location.reload()
                    }
                  }}
                >
                  <X className="ml-3 h-5 w-5" />
                  <div>
                    <div className="font-semibold">مسح المحادثة</div>
                    <div className="text-xs text-red-400">حذف جميع الرسائل</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* شريط المعلومات السفلي */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span>⏰</span>
            <span>الإثنين-السبت: 09:00-18:00</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span>📞</span>
            <span>طوارئ: 24/7</span>
          </div>
        </div>
      </div>
    </div>
  )
}
