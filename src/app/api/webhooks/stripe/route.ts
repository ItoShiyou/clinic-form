import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const getPlan = (priceId: string) => {
    if (priceId === process.env.STRIPE_LITE_PRICE_ID) return 'lite'
    if (priceId === process.env.STRIPE_STANDARD_PRICE_ID) return 'standard'
    if (priceId === process.env.STRIPE_CLINIC_PRICE_ID) return 'clinic'
    return 'lite'
  }

  switch (event.type) {
    // Checkout完了時にプランとサブスクリプションIDを即時反映
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break
      const plan = session.metadata?.plan
      const clinicId = session.metadata?.clinic_id
      if (!plan || !clinicId) break
      const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id
      if (!subscriptionId) break
      await supabaseAdmin
        .from('clinics')
        .update({ plan, stripe_subscription_id: subscriptionId })
        .eq('id', clinicId)
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const priceId = sub.items.data[0].price.id
      const plan = getPlan(priceId)
      await supabaseAdmin
        .from('clinics')
        .update({ plan, stripe_subscription_id: sub.id })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabaseAdmin
        .from('clinics')
        .update({ plan: 'lite', stripe_subscription_id: null })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }
  }

  return NextResponse.json({ received: true })
}
