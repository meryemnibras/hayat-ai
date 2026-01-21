'use client'

import React, { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'
import { Analytics } from '@/src/lib/analytics'

interface PaymentButtonProps {
  treatmentName: string
  price: number
  className?: string
  onSuccess?: () => void
}

export function PaymentButton({ 
  treatmentName, 
  price,
  className,
  onSuccess 
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      Analytics.trackEvent('Payment Initiated', {
        category: 'Conversion',
        treatment: treatmentName,
        price: price / 100,
      })

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentName,
          price,
          metadata: {
            source: 'chat',
          },
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('حدث خطأ. الرجاء المحاولة مرة أخرى.')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-2
        bg-gradient-to-r from-primary-500 to-teal-600
        hover:from-primary-600 hover:to-teal-700
        text-white font-bold py-3 px-6 rounded-xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>جاري التحويل...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>ادفع الآن ${(price / 100).toFixed(2)}</span>
        </>
      )}
    </button>
  )
}





