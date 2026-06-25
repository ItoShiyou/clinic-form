import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Vercel Cron から呼ばれる（vercel.json で毎月1日0時に設定）
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error, count } = await supabaseAdmin
    .from('clinics')
    .update({ response_count_this_month: 0 })
    .neq('response_count_this_month', 0) // 既に0のものは更新しない

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, updated: count ?? 0 })
}
