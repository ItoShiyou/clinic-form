import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { formId, data } = await req.json()

  const { data: form } = await supabaseAdmin
    .from('forms')
    .select('*, clinics(*)')
    .eq('id', formId)
    .single()

  if (!form || !form.is_active) {
    return NextResponse.json({ error: 'フォームが見つかりません' }, { status: 404 })
  }

  const clinic = form.clinics as { id: string; plan: string; response_count_this_month: number }
  const plan = PLANS[clinic.plan as keyof typeof PLANS]

  if (
    plan.maxResponsesPerMonth !== Infinity &&
    clinic.response_count_this_month >= plan.maxResponsesPerMonth
  ) {
    return NextResponse.json(
      { error: '今月の回答上限に達しました。クリニックにお問い合わせください。' },
      { status: 403 }
    )
  }

  const { error: insertError } = await supabaseAdmin
    .from('responses')
    .insert({ form_id: formId, clinic_id: clinic.id, data })

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  await supabaseAdmin
    .from('clinics')
    .update({ response_count_this_month: clinic.response_count_this_month + 1 })
    .eq('id', clinic.id)

  // メール通知（非同期、失敗しても無視）
  try {
    const { data: clinicFull } = await supabaseAdmin
      .from('clinics')
      .select('name')
      .eq('id', clinic.id)
      .single()

    const { data: user } = await supabaseAdmin.auth.admin.getUserById(clinic.id)
    const email = user?.user?.email

    if (email) {
      await resend.emails.send({
        from: 'クリニックフォーム <noreply@clinicform.jp>',
        to: email,
        subject: `【新しい回答】${form.title}`,
        html: `<p>${clinicFull?.name ?? 'クリニック'}様、「${form.title}」に新しい回答が届きました。</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/responses">ダッシュボードで確認する</a></p>`,
      })
    }
  } catch {
    // メール通知は失敗しても回答保存は成功とする
  }

  return NextResponse.json({ success: true })
}
