import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessionId } = await req.json() as { sessionId: string }
    if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // 支払い完了・トライアル開始済みのセッションのみ処理
    if (session.status !== 'complete') {
      return NextResponse.json({ error: 'Session not complete' }, { status: 400 })
    }

    const plan = session.metadata?.plan
    const clinicId = session.metadata?.clinic_id
    if (!plan || !clinicId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // セッションが本人のものか確認
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
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
