import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import QRDisplay from './QRDisplay'

export default async function QRPage({ params }: { params: Promise<{ formId: string }> }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { formId } = await params

  const { data: form } = await supabaseAdmin
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single()

  if (!form) redirect('/dashboard/forms')

  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/f/${formId}`

  return (
    <div className="p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">フォームを共有</h1>
        <p className="text-gray-500 mb-8">「{form.title}」のQRコードとURLを患者さんに共有してください</p>

        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center mb-6">
          <QRDisplay url={formUrl} />
          <p className="text-sm text-gray-500 mt-4">印刷して待合室に掲示できます</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <p className="text-xs text-gray-500 mb-1">フォームURL</p>
          <div className="flex items-center gap-2">
            <a
              href={formUrl}
              target="_blank"
              className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded-lg text-blue-600 break-all hover:underline"
            >
              {formUrl}
            </a>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={`/f/${formId}`}
            target="_blank"
            className="flex-1 text-center border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            フォームを確認
          </a>
          <a
            href={`/dashboard/forms/${formId}`}
            className="flex-1 text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            フォームを編集
          </a>
        </div>
      </div>
    </div>
  )
}
