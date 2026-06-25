import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import type { PlanKey } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessionId } = await req.json() as { sessionId: string }
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.status !== 'complete') {
      return NextResponse.json({ error: 'Session not complete' }, { status: 400 })
    }

    const plan = session.metadata?.plan as PlanKey | undefined
    const clinicId = session.metadata?.clinic_id

    // metadata の plan が既知のプランか検証してから DB に書き込む
    if (!plan || !(plan in PLANS) || !clinicId) {
      return NextResponse.json({ error: 'Invalid session metadata' }, { status: 400 })
    }

    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('id', clinicId)
      .eq('clerk_user_id', userId)
      .single()

    if (!clinic) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id

    await supabaseAdmin
      .from('clinics')
      .update({ plan, ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {}) })
      .eq('id', clinicId)

    return NextResponse.json({ plan })
  } catch {
    // 内部エラーの詳細はクライアントに返さない
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
