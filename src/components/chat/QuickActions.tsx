'use client'

import React from 'react'
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  Phone, 
  MapPin,
  Clock,
  Users,
  MessageCircle,
  Sparkles,
  Zap
} from 'lucide-react'

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  message: string
  color: string
  bgColor: string
}

const quickActions: QuickAction[] = [
  {
    id: 'price-hair',
    icon: <DollarSign className="h-5 w-5" />,
    label: 'أسعار زراعة الشعر',
    message: 'كم سعر زراعة الشعر؟ وما التقنيات المتاحة؟',
    color: 'text-primary-600',
    bgColor: 'from-primary-50 to-primary-100'
  },
  {
    id: 'book-appointment',
    icon: <Calendar className="h-5 w-5" />,
    label: 'حجز موعد',
    message: 'أريد حجز موعد استشارة',
    color: 'text-teal-600',
    bgColor: 'from-teal-50 to-teal-100'
  },
  {
    id: 'working-hours',
    icon: <Clock className="h-5 w-5" />,
    label: 'أوقات العمل',
    message: 'ما هي أوقات عمل العيادة؟',
    color: 'text-navy-600',
    bgColor: 'from-navy-50 to-navy-100'
  },
  {
    id: 'location',
    icon: <MapPin className="h-5 w-5" />,
    label: 'الموقع',
    message: 'أين تقع العيادة؟ وكيف أصل إليها؟',
    color: 'text-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100'
  },
  {
    id: 'doctors',
    icon: <Users className="h-5 w-5" />,
    label: 'الأطباء',
    message: 'من هم الأطباء في العيادة؟',
    color: 'text-primary-600',
    bgColor: 'from-primary-50 to-primary-100'
  },
  {
    id: 'tourism',
    icon: <FileText className="h-5 w-5" />,
    label: 'السياحة العلاجية',
    message: 'ماذا تشمل باقات السياحة العلاجية؟',
    color: 'text-teal-600',
    bgColor: 'from-teal-50 to-teal-100'
  },
  {
    id: 'payment',
    icon: <DollarSign className="h-5 w-5" />,
    label: 'طرق الدفع',
    message: 'ما هي طرق الدفع المتاحة؟ هل يوجد تقسيط؟',
    color: 'text-navy-600',
    bgColor: 'from-navy-50 to-navy-100'
  },
  {
    id: 'contact',
    icon: <Phone className="h-5 w-5" />,
    label: 'التواصل',
    message: 'كيف أتواصل مع العيادة؟',
    color: 'text-cyan-600',
    bgColor: 'from-cyan-50 to-cyan-100'
  }
]

interface QuickActionsProps {
  onSelectAction: (message: string) => void
  disabled?: boolean
}

export function QuickActions({ onSelectAction, disabled = false }: QuickActionsProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 via-teal-50 to-navy-50 p-6 shadow-xl border-2 border-primary-100">
      {/* نمط خلفي ديكوري */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-200 rounded-full blur-3xl opacity-30" />
      
      {/* المحتوى */}
      <div className="relative z-10">
        {/* العنوان */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-2xl shadow-glow-green">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                كيف يمكنني مساعدتك؟
                <Zap className="w-5 h-5 text-yellow-500" />
              </h3>
              <p className="text-sm text-gray-600">اختر سؤالاً أو اكتب سؤالك الخاص</p>
            </div>
          </div>
          
          {/* شارة */}
          <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-primary-200">
            <span className="text-xs font-bold text-gradient-primary">AI مدعوم</span>
          </div>
        </div>
        
        {/* الأزرار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onSelectAction(action.message)}
              disabled={disabled}
              className={`
                group relative overflow-hidden
                flex flex-col items-center gap-3 p-4 rounded-2xl
                bg-gradient-to-br ${action.bgColor}
                border-2 border-transparent
                hover:border-primary-300 hover:shadow-lg hover:shadow-primary-200/50
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-95
                transform hover:-translate-y-1
              `}
            >
              {/* خلفية متحركة */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* المحتوى */}
              <div className="relative z-10 flex flex-col items-center gap-2 w-full">
                <div className={`
                  ${action.color} group-hover:scale-110 transition-transform duration-300
                  flex items-center justify-center w-12 h-12 
                  bg-white rounded-xl shadow-md
                  group-hover:shadow-lg
                `}>
                  {action.icon}
                </div>
                <span className="text-sm font-bold text-gray-800 text-center leading-tight group-hover:text-navy-900 transition-colors">
                  {action.label}
                </span>
              </div>
              
              {/* مؤشر */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </button>
          ))}
        </div>

        {/* نصيحة */}
        <div className="mt-5 flex items-center justify-center gap-2 text-sm">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-primary-100">
            <MessageCircle className="w-4 h-4 text-primary-600" />
            <span className="text-gray-700">
              💡 <strong className="text-navy-900">نصيحة:</strong> اضغط على أي سؤال، أو اكتب سؤالك في الأسفل
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
