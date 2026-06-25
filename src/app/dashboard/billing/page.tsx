'use client'

import { useState } from 'react'
import { PLANS } from '@/lib/stripe'

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('エラーが発生しました')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プラン・請求</h1>
        <p className="text-gray-500 mt-1">すべてのプランで14日間無料トライアル</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div key={key} className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">¥{plan.price.toLocaleString()}</span>
              <span className="text-gray-500 text-sm">/月</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ フォーム: {plan.maxForms === Infinity ? '無制限' : `${plan.maxForms}個`}</li>
              <li>✓ 月間回答: {plan.maxResponsesPerMonth === Infinity ? '無制限' : `${plan.maxResponsesPerMonth}件`}</li>
              <li>✓ CSVエクスポート</li>
              <li>✓ メール通知</li>
              <li>✓ QRコード生成</li>
            </ul>
            <button
              onClick={() => handleUpgrade(key)}
              disabled={loading !== null}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading === key ? '処理中...' : '14日間無料で試す'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
