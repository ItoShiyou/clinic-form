import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe, PLANS } from '@/lib/stripe'
import type { PlanKey } from '@/lib/stripe'
import BillingClient from './BillingClient'

async function getTrialedPlans(stripeCustomerId: string | null): Promise<PlanKey[]> {
  if (!stripeCustomerId) return []

  const priceIdToPlan: Record<string, PlanKey> = {
    [process.env.STRIPE_LITE_PRICE_ID!]: 'lite',
    [process.env.STRIPE_STANDARD_PRICE_ID!]: 'standard',
    [process.env.STRIPE_CLINIC_PRICE_ID!]: 'clinic',
  }

  // キャンセル済みを含む全サブスクリプションを取得
  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: 'all',
    limit: 100,
  })

  const trialed = new Set<PlanKey>()
  for (const sub of subscriptions.data) {
    // トライアルを使ったサブスクリプションのみ対象
    if (sub.trial_start == null) continue
    for (const item of sub.items.data) {
      const plan = priceIdToPlan[item.price.id]
      if (plan) trialed.add(plan)
    }
  }

  return Array.from(trialed)
}

export default async function BillingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('plan, stripe_subscription_id, stripe_customer_id')
    .eq('clerk_user_id', userId)
    .single()

  const trialedPlans = await getTrialedPlans(clinic?.stripe_customer_id ?? null)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プラン・請求</h1>
        <p className="text-gray-500 mt-1">はじめてのプランは14日間無料トライアル</p>
      </div>

      {/* 現在のプラン */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 max-w-4xl">
        <p className="text-sm text-blue-700">
          現在のプラン：
          <span className="font-bold ml-1">
            {PLANS[clinic?.plan as keyof typeof PLANS]?.name ?? 'ライト'}
          </span>
        </p>
      </div>

      <BillingClient
        currentPlan={clinic?.plan ?? 'lite'}
        hasPurchasedPlan={!!clinic?.stripe_subscription_id}
        trialedPlans={trialedPlans}
      />
    </div>
  )
}
