import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('stripe_customer_id')
      .eq('clerk_user_id', userId)
      .single()

    if (!clinic?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: clinic.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
