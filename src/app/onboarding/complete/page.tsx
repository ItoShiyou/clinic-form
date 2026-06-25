import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { stripe, PLANS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import type { PlanKey } from '@/lib/stripe'

export default async function OnboardingCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { session_id } = await searchParams
  if (!session_id) redirect('/onboarding/plan')

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.status !== 'complete') redirect('/onboarding/plan')

    const plan = session.metadata?.plan as PlanKey | undefined
    const clinicId = session.metadata?.clinic_id

    if (!plan || !(plan in PLANS) || !clinicId) redirect('/onboarding/plan')

    // 本人確認
    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('id', clinicId)
      .eq('clerk_user_id', userId)
      .single()

    if (!clinic) redirect('/onboarding/plan')

    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : (session.subscription as { id: string } | null)?.id

    await supabaseAdmin
      .from('clinics')
      .update({
        plan,
        ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {}),
      })
      .eq('id', clinicId)
  } catch {
    redirect('/onboarding/plan')
  }

  redirect('/dashboard')
}
