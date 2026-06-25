import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import type { PlanKey } from '@/lib/stripe'

const PLAN_ORDER: PlanKey[] = ['lite', 'standard', 'clinic']

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { plan, isOnboarding } = await req.json() as { plan: PlanKey; isOnboarding?: boolean }
    const planConfig = PLANS[plan]
    if (!planConfig) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    // 既存サブスクリプションがある場合: プラン変更（トライアルなし）
    if (clinic.stripe_subscription_id) {
      const currentPlanIndex = PLAN_ORDER.indexOf(clinic.plan as PlanKey)
      const newPlanIndex = PLAN_ORDER.indexOf(plan)

      if (newPlanIndex <= currentPlanIndex) {
        return NextResponse.json({ error: 'Use the Stripe portal to downgrade or cancel' }, { status: 400 })
      }

      const subscription = await stripe.subscriptions.retrieve(clinic.stripe_subscription_id)
      const subscriptionItemId = subscription.items.data[0].id

      await stripe.subscriptions.update(clinic.stripe_subscription_id, {
        items: [{ id: subscriptionItemId, price: planConfig.priceId }],
        proration_behavior: 'create_prorations',
      })

      await supabaseAdmin
        .from('clinics')
        .update({ plan })
        .eq('id', clinic.id)

      return NextResponse.json({ url: `${appUrl}/dashboard?upgraded=1` })
    }

    // Stripeカスタマー作成（初回のみ）
    let customerId = clinic.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { clerk_user_id: userId, clinic_id: clinic.id },
      })
      customerId = customer.id
      await supabaseAdmin
        .from('clinics')
        .update({ stripe_customer_id: customerId })
        .eq('id', clinic.id)
    }

    // アカウントとして一度でもトライアルを使ったか確認
    const pastSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    })
    const hasEverTrialed = pastSubs.data.some((sub) => sub.trial_start != null)

    // オンボーディング時は /onboarding/complete へ、それ以外は /dashboard へ
    const successUrl = isOnboarding
      ? `${appUrl}/onboarding/complete?session_id={CHECKOUT_SESSION_ID}`
      : `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: isOnboarding
        ? `${appUrl}/onboarding/plan`
        : `${appUrl}/dashboard/billing`,
      ...(!hasEverTrialed ? { subscription_data: { trial_period_days: 14 } } : {}),
      metadata: { plan, clinic_id: clinic.id },
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
