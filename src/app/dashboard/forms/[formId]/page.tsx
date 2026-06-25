import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import FormBuilder from '@/components/forms/FormBuilder'
import type { FormField } from '@/lib/supabase'

export default async function EditFormPage({ params }: { params: Promise<{ formId: string }> }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { formId } = await params

  const { data: form } = await supabaseAdmin
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single()

  if (!form) redirect('/dashboard/forms')

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-gray-100 px-8 py-4 bg-white">
        <h1 className="font-bold text-gray-900">フォームを編集</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <FormBuilder
          formId={formId}
          initialTitle={form.title}
          initialDescription={form.description ?? ''}
          initialFields={form.fields as FormField[]}
        />
      </div>
    </div>
  )
}
