import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'
import PlanSelector from './PlanSelector'

async function checkHasTrialed(stripeCustomerId: string | null): Promise<boolean> {
  if (!stripeCustomerId) return false
  const subs = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: 'all',
    limit: 10,
  })
  return subs.data.some((sub) => sub.trial_start != null)
}

export default async function OnboardingPlanPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('stripe_customer_id')
    .eq('clerk_user_id', userId)
    .single()

  // クリニック未登録なら医院名入力へ
  if (!clinic) redirect('/onboarding')

  const hasTrialed = await checkHasTrialed(clinic.stripe_customer_id ?? null)

  return <PlanSelector hasTrialed={hasTrialed} />
}
