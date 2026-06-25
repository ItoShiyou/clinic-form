'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type State = 'idle' | 'verifying' | 'success' | 'error'

export default function UpgradeBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [state, setState] = useState<State>('idle')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    // 既存の upgraded=1 フォールバックも維持（アップグレード即時更新ルート用）
    const upgraded = searchParams.get('upgraded')

    if (upgraded === '1') {
      setState('success')
      router.replace('/dashboard', { scroll: false })
      return
    }

    if (!sessionId) return

    setState('verifying')
    router.replace('/dashboard', { scroll: false })

    fetch('/api/billing/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => {
        if (res.ok) {
          setState('success')
          // プラン表示を最新に更新
          router.refresh()
        } else {
          setState('error')
        }
      })
      .catch(() => setState('error'))
  }, [searchParams, router])

  if (state === 'verifying') {
    return (
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-medium">プランを確認しています...</p>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm text-green-800 font-medium">
          プランのアップグレードが完了しました。新しいプランが適用されています。
        </p>
        <button
          onClick={() => setState('idle')}
          className="text-green-600 hover:text-green-800 text-sm ml-4"
        >
          ✕
        </button>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm text-yellow-800 font-medium">
          プランの確認に失敗しました。しばらくしてからページを再読み込みしてください。
        </p>
        <button
          onClick={() => setState('idle')}
          className="text-yellow-600 hover:text-yellow-800 text-sm ml-4"
        >
          ✕
        </button>
      </div>
    )
  }

  return null
}
