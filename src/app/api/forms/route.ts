import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, fields } = await req.json()

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })

  const plan = PLANS[clinic.plan as keyof typeof PLANS]

  const { data: existingForms } = await supabaseAdmin
    .from('forms')
    .select('id')
    .eq('clinic_id', clinic.id)

  if (plan.maxForms !== Infinity && (existingForms?.length ?? 0) >= plan.maxForms) {
    return NextResponse.json(
      { error: `現在のプランではフォームを${plan.maxForms}個まで作成できます。プランをアップグレードしてください。` },
      { status: 403 }
    )
  }

  const { data: form, error } = await supabaseAdmin
    .from('forms')
    .insert({ clinic_id: clinic.id, title, description, fields, is_active: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(form)
}
