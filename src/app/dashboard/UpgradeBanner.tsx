'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function UpgradeBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('upgraded') === '1') {
      setVisible(true)
      // URLからクエリパラメータを除去
      router.replace('/dashboard', { scroll: false })
    }
  }, [searchParams, router])

  if (!visible) return null

  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
      <p className="text-sm text-green-800 font-medium">
        プランのアップグレードが完了しました。新しいプランが適用されています。
      </p>
      <button
        onClick={() => setVisible(false)}
        className="text-green-600 hover:text-green-800 text-sm ml-4"
      >
        ✕
      </button>
    </div>
  )
}
