'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Analytics } from '@/src/lib/analytics'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')

  useEffect(() => {
    Analytics.trackEvent('Payment Completed', {
      category: 'Conversion',
      sessionId,
    })
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-teal-50 to-navy-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border-2 border-primary-100">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-navy-900 mb-3">
          تم الدفع بنجاح! 🎉
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          شكراً لك! تم استلام دفعتك بنجاح. سنتواصل معك قريباً لتأكيد موعدك.
        </p>

        <div className="bg-primary-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong className="text-navy-900">رقم المعاملة:</strong>
            <br />
            <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
              {sessionId}
            </code>
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-primary text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
          >
            العودة للصفحة الرئيسية
            <ArrowRight className="w-5 h-5 inline mr-2" />
          </Link>

          <a
            href={`https://wa.me/00905362266054?text=${encodeURIComponent('مرحباً، أكملت الدفع. رقم المعاملة: ' + sessionId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            تواصل معنا عبر واتساب
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          ستصلك رسالة تأكيد على بريدك الإلكتروني خلال دقائق
        </p>
      </div>
    </div>
  )
}





