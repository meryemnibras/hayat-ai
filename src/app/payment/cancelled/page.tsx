'use client'

import React from 'react'
import { XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-teal-50 to-navy-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border-2 border-gray-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-navy-900 mb-3">
          تم إلغاء الدفع
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          لم تكتمل عملية الدفع. يمكنك المحاولة مرة أخرى أو التواصل معنا للمساعدة.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-primary text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
          >
            العودة للصفحة الرئيسية
            <ArrowRight className="w-5 h-5 inline mr-2" />
          </Link>

          <a
            href="https://wa.me/00905362266054"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            تحدث مع فريق الدعم
          </a>
        </div>
      </div>
    </div>
  )
}










