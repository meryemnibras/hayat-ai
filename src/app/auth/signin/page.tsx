'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Phone, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [method, setMethod] = useState<'phone' | 'google'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (step === 'phone') {
      // إرسال رمز التحقق (يجب تنفيذه مع خدمة SMS)
      // في المثال: نفترض أن الرمز أُرسل
      setStep('code')
      setIsLoading(false)
    } else {
      // تسجيل الدخول
      const result = await signIn('credentials', {
        phone,
        code,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      } else {
        alert('رمز التحقق غير صحيح')
      }
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-teal-50 to-navy-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4 shadow-glow-green">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            مرحباً بك في حياة
          </h1>
          <p className="text-gray-600">
            سجّل دخولك للوصول لحسابك
          </p>
        </div>

        {/* البطاقة */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-primary-100">
          {/* اختيار الطريقة */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                method === 'phone'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Phone className="w-5 h-5 inline-block ml-2" />
              الهاتف
            </button>
            <button
              onClick={() => setMethod('google')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                method === 'google'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-5 h-5 inline-block ml-2" />
              Google
            </button>
          </div>

          {/* النموذج */}
          {method === 'phone' ? (
            <form onSubmit={handlePhoneSignIn} className="space-y-4">
              {step === 'phone' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                    dir="ltr"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="xxxx"
                    required
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-center text-2xl tracking-widest"
                    dir="ltr"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    أُرسل رمز التحقق إلى {phone}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {step === 'phone' ? 'إرسال رمز التحقق' : 'تسجيل الدخول'}
                <ArrowRight className="w-5 h-5" />
              </button>

              {step === 'code' && (
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-primary-600 hover:text-primary-700 font-semibold"
                >
                  تغيير رقم الهاتف
                </button>
              )}
            </form>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              تسجيل الدخول بـ Google
            </button>
          )}
        </div>

        {/* روابط إضافية */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            بالتسجيل، أنت توافق على{' '}
            <a href="/terms" className="text-primary-600 hover:underline font-semibold">
              الشروط والأحكام
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
