import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import FormBuilder from '@/components/forms/FormBuilder'

export default async function NewFormPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-gray-100 px-8 py-4 bg-white flex items-center justify-between">
        <h1 className="font-bold text-gray-900">新しいフォームを作成</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <FormBuilder />
      </div>
    </div>
  )
}
