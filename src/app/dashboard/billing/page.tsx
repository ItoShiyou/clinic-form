import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { PLANS } from '@/lib/plans'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('plan, stripe_subscription_id')
    .eq('clerk_user_id', userId)
    .single()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プラン・請求</h1>
        <p className="text-gray-500 mt-1">プランのアップグレードや解約はこちらから</p>
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
      />
    </div>
  )
}
