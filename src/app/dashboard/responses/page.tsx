import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import ResponsesClient from './ResponsesClient'
import type { FormField } from '@/lib/supabase'

export default async function ResponsesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  const { data: forms } = await supabaseAdmin
    .from('forms')
    .select('id, title')
    .eq('clinic_id', clinic?.id ?? '')
    .order('created_at', { ascending: false })

  const { data: responses } = await supabaseAdmin
    .from('responses')
    .select('*, forms(title, fields)')
    .eq('clinic_id', clinic?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">回答一覧</h1>
          <p className="text-gray-500 mt-1">{responses?.length ?? 0}件の回答</p>
        </div>
      </div>

      <ResponsesClient
        responses={(responses ?? []).map((r) => ({
          ...r,
          formTitle: (r.forms as { title: string } | null)?.title ?? '',
          fields: ((r.forms as { fields: FormField[] } | null)?.fields ?? []),
          status: (r.status ?? 'unchecked') as 'unchecked' | 'checked' | 'in_progress' | 'done',
        }))}
        forms={forms ?? []}
      />
    </div>
  )
}
