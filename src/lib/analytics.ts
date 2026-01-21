'use client'

import mixpanel from 'mixpanel-browser'
import ReactGA from 'react-ga4'

// ═══════════════════════════════════════
// تهيئة Analytics
// ═══════════════════════════════════════

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

let analyticsInitialized = false

export function initAnalytics() {
  if (analyticsInitialized) return
  
  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      gaOptions: {
        anonymizeIp: true,
      }
    })
    console.log('✅ Google Analytics initialized')
  }
  
  // Mixpanel
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    })
    console.log('✅ Mixpanel initialized')
  }
  
  analyticsInitialized = true
}

// ═══════════════════════════════════════
// تتبع الصفحات
// ═══════════════════════════════════════

export function trackPageView(url: string, title?: string) {
  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: url,
      title: title || document.title
    })
  }
  
  // Mixpanel
  if (MIXPANEL_TOKEN) {
    mixpanel.track('Page View', {
      url,
      title: title || document.title,
      referrer: document.referrer,
    })
  }
}

// ═══════════════════════════════════════
// تتبع الأحداث
// ═══════════════════════════════════════

interface EventProperties {
  [key: string]: any
}

export function trackEvent(
  eventName: string, 
  properties?: EventProperties
) {
  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: properties?.category || 'User',
      action: eventName,
      label: properties?.label,
      value: properties?.value,
    })
  }
  
  // Mixpanel
  if (MIXPANEL_TOKEN) {
    mixpanel.track(eventName, properties)
  }
  
  console.log('📊 Event tracked:', eventName, properties)
}

// ═══════════════════════════════════════
// أحداث مخصصة للعيادة
// ═══════════════════════════════════════

export const Analytics = {
  // بدء محادثة
  chatStarted: () => {
    trackEvent('Chat Started', {
      category: 'Engagement',
      timestamp: new Date().toISOString(),
    })
  },

  // إرسال رسالة
  messageSent: (messageLength: number, isFirstMessage: boolean) => {
    trackEvent('Message Sent', {
      category: 'Chat',
      messageLength,
      isFirstMessage,
    })
  },

  // نقر على سؤال سريع
  quickActionClicked: (actionLabel: string) => {
    trackEvent('Quick Action Clicked', {
      category: 'Engagement',
      action: actionLabel,
    })
  },

  // فتح WhatsApp
  whatsappOpened: (source: 'widget' | 'header' | 'message') => {
    trackEvent('WhatsApp Opened', {
      category: 'Contact',
      source,
    })
  },

  // نقر على رقم الهاتف
  phoneClicked: () => {
    trackEvent('Phone Clicked', {
      category: 'Contact',
    })
  },

  // حجز موعد (محاولة)
  appointmentAttempt: () => {
    trackEvent('Appointment Attempt', {
      category: 'Conversion',
    })
  },

  // استفسار عن سعر
  priceInquiry: (treatment: string) => {
    trackEvent('Price Inquiry', {
      category: 'Interest',
      treatment,
    })
  },

  // مشاهدة علاج معين
  treatmentViewed: (treatment: string) => {
    trackEvent('Treatment Viewed', {
      category: 'Interest',
      treatment,
    })
  },

  // مسح المحادثة
  chatCleared: () => {
    trackEvent('Chat Cleared', {
      category: 'Engagement',
    })
  },

  // خطأ في النظام
  systemError: (errorMessage: string) => {
    trackEvent('System Error', {
      category: 'Error',
      errorMessage,
    })
  },

  // مدة الجلسة
  sessionDuration: (durationInSeconds: number) => {
    trackEvent('Session Duration', {
      category: 'Engagement',
      value: durationInSeconds,
    })
  },

  // تتبع حدث مخصص
  trackEvent: (eventName: string, properties?: EventProperties) => {
    trackEvent(eventName, properties)
  },
}

// ═══════════════════════════════════════
// تحديد هوية المستخدم
// ═══════════════════════════════════════

export function identifyUser(userId: string, traits?: {
  name?: string
  email?: string
  phone?: string
  role?: string
}) {
  // Mixpanel
  if (MIXPANEL_TOKEN) {
    mixpanel.identify(userId)
    if (traits) {
      mixpanel.people.set(traits)
    }
  }
  
  // Google Analytics
  if (GA_MEASUREMENT_ID) {
    ReactGA.set({ userId })
  }
}

// ═══════════════════════════════════════
// إعادة تعيين المستخدم
// ═══════════════════════════════════════

export function resetUser() {
  if (MIXPANEL_TOKEN) {
    mixpanel.reset()
  }
}

