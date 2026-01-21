import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { WhatsAppWidget } from '@/components/whatsapp/WhatsAppWidget'

const cairo = Cairo({ 
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo'
})

export const metadata: Metadata = {
  title: 'عيادة حياة للتجميل - إسطنبول | Hayat Beauty Clinic',
  description: 'عيادة حياة للتجميل في إسطنبول - خدمات تجميل متكاملة: زراعة الشعر، تجميل الأنف، شفط الدهون، ابتسامة هوليوود، وأكثر',
  keywords: ['عيادة تجميل', 'إسطنبول', 'زراعة الشعر', 'تجميل الأنف', 'ابتسامة هوليوود', 'تركيا'],
  authors: [{ name: 'Hayat Beauty Clinic' }],
  openGraph: {
    title: 'عيادة حياة للتجميل - إسطنبول',
    description: 'خدمات تجميل عالمية المستوى في قلب إسطنبول',
    type: 'website',
    locale: 'ar_SA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'عيادة حياة للتجميل'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عيادة حياة للتجميل',
    description: 'خدمات تجميل عالمية المستوى في إسطنبول',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={cairo.className}>
        {children}
        
        {/* WhatsApp Widget العائم */}
        <WhatsAppWidget 
          phoneNumber="00905362266054"
          message="مرحباً، أود الاستفسار عن خدمات عيادة حياة للتجميل"
          position="left"
        />
      </body>
    </html>
  )
}









