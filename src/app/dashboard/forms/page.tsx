import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

export default async function FormsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  const { data: forms } = await supabaseAdmin
    .from('forms')
    .select('*')
    .eq('clinic_id', clinic?.id ?? '')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">フォーム一覧</h1>
          <p className="text-gray-500 mt-1">{forms?.length ?? 0}個のフォーム</p>
        </div>
        <Link
          href="/dashboard/forms/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 新規作成
        </Link>
      </div>

      {!forms || forms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">フォームがまだありません</h2>
          <p className="text-gray-500 mb-6 text-sm">最初のフォームを作成しましょう</p>
          <Link
            href="/dashboard/forms/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            フォームを作成
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div key={form.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{form.title}</h3>
                {form.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{form.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {(form.fields as unknown[])?.length ?? 0}項目 · {new Date(form.created_at).toLocaleDateString('ja-JP')}作成
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/f/${form.id}`}
                  target="_blank"
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  プレビュー
                </Link>
                <Link
                  href={`/dashboard/forms/${form.id}/qr`}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
                >
                  QRコード
                </Link>
                <Link
                  href={`/dashboard/forms/${form.id}`}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100"
                >
                  編集
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
