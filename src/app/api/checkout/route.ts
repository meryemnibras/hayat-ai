import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '../../../lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { 
      treatmentName, 
      price, 
      customerEmail,
      metadata 
    } = await req.json()

    if (!treatmentName || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL

    const session = await createCheckoutSession({
      treatmentName,
      price,
      customerEmail,
      successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/payment/cancelled`,
      metadata,
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}







