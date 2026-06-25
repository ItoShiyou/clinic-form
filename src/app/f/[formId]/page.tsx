import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PublicFormClient from './PublicFormClient'
import type { FormField } from '@/lib/supabase'

export default async function PublicFormPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = await params

  const { data: form } = await supabaseAdmin
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('is_active', true)
    .single()

  if (!form) notFound()

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('name')
    .eq('id', form.clinic_id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-blue-600 px-8 py-6">
            <p className="text-blue-100 text-sm mb-1">{clinic?.name}</p>
            <h1 className="text-2xl font-bold text-white">{form.title}</h1>
            {form.description && (
              <p className="text-blue-100 mt-2 text-sm">{form.description}</p>
            )}
          </div>

          {/* フォーム */}
          <div className="px-8 py-6">
            <PublicFormClient
              formId={form.id}
              fields={form.fields as FormField[]}
            />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by クリニックフォーム
        </p>
      </div>
    </div>
  )
}
