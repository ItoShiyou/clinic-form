import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  const { data: forms } = await supabaseAdmin
    .from('forms')
    .select('id')
    .eq('clinic_id', clinic?.id ?? '')

  const { data: responses } = await supabaseAdmin
    .from('responses')
    .select('id, created_at')
    .eq('clinic_id', clinic?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(5)

  const totalForms = forms?.length ?? 0
  const totalResponses = responses?.length ?? 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-500 mt-1">フォームの作成・管理・回答の確認ができます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">フォーム数</p>
          <p className="text-3xl font-bold text-gray-900">{totalForms}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">今月の回答数</p>
          <p className="text-3xl font-bold text-gray-900">{clinic?.response_count_this_month ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">現在のプラン</p>
          <p className="text-xl font-bold text-blue-600 capitalize">{clinic?.plan ?? 'ライト'}</p>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/forms/new"
          className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <div className="text-2xl mb-2">➕</div>
          <h3 className="font-bold text-lg mb-1">新しいフォームを作成</h3>
          <p className="text-blue-100 text-sm">問診・予約・アンケートフォームを作成</p>
        </Link>
        <Link
          href="/dashboard/responses"
          className="bg-white border border-gray-100 p-6 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-bold text-lg text-gray-900 mb-1">回答を確認</h3>
          <p className="text-gray-500 text-sm">患者さんからの回答を確認・CSV出力</p>
        </Link>
      </div>

      {/* 最新の回答 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">最新の回答</h2>
        {totalResponses === 0 ? (
          <p className="text-gray-500 text-sm">まだ回答がありません。フォームを作成して患者さんに共有しましょう。</p>
        ) : (
          <div className="space-y-2">
            {responses?.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">回答 #{r.id.slice(0, 8)}</span>
                <span className="text-xs text-gray-400">
                  {new Date(r.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
