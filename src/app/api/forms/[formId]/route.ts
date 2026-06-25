import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(req: Request, { params }: { params: Promise<{ formId: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { formId } = await params
  const { title, description, fields } = await req.json()

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: form, error } = await supabaseAdmin
    .from('forms')
    .update({ title, description, fields })
    .eq('id', formId)
    .eq('clinic_id', clinic.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(form)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ formId: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { formId } = await params

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await supabaseAdmin
    .from('forms')
    .delete()
    .eq('id', formId)
    .eq('clinic_id', clinic.id)

  return NextResponse.json({ success: true })
}
