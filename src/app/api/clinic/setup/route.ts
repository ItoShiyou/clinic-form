import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()

  const { data: existing } = await supabaseAdmin
    .from('clinics')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (existing) return NextResponse.json(existing)

  const { data, error } = await supabaseAdmin
    .from('clinics')
    .insert({
      clerk_user_id: userId,
      name: name ?? 'クリニック',
      plan: 'lite',
      response_count_this_month: 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
