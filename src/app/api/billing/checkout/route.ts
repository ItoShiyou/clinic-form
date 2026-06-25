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

    const { plan } = await req.json() as { plan: PlanKey }
    const planConfig = PLANS[plan]
    if (!planConfig) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`

    // 既存サブスクリプションがある場合はアップグレード処理
    if (clinic.stripe_subscription_id) {
      const currentPlanIndex = PLAN_ORDER.indexOf(clinic.plan as PlanKey)
      const newPlanIndex = PLAN_ORDER.indexOf(plan)

      if (newPlanIndex <= currentPlanIndex) {
        return NextResponse.json({ error: 'Downgrade is not supported via this endpoint' }, { status: 400 })
      }

      const subscription = await stripe.subscriptions.retrieve(clinic.stripe_subscription_id)
      const subscriptionItemId = subscription.items.data[0].id

      await stripe.subscriptions.update(clinic.stripe_subscription_id, {
        items: [{ id: subscriptionItemId, price: planConfig.priceId }],
        proration_behavior: 'create_prorations',
      })

      // Webhook到着前にDBを即時更新
      await supabaseAdmin
        .from('clinics')
        .update({ plan })
        .eq('id', clinic.id)

      return NextResponse.json({ url: successUrl })
    }

    // 新規サブスクリプション: Stripe Checkout セッションを作成
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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      subscription_data: { trial_period_days: 14 },
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
