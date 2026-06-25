import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: Request, { params }: { params: Promise<{ responseId: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { responseId } = await params
  const { status } = await req.json()

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabaseAdmin
    .from('responses')
    .update({ status })
    .eq('id', responseId)
    .eq('clinic_id', clinic.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
