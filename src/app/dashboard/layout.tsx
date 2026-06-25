import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Sidebar from './Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('plan, stripe_subscription_id')
    .eq('clerk_user_id', userId)
    .single()

  if (!clinic) redirect('/onboarding')

  if (!clinic.stripe_subscription_id) redirect('/onboarding/plan')

  const plan = clinic.plan ?? 'lite'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar plan={plan} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
