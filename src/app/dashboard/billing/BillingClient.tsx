'use client'

import { useState } from 'react'
import { PLANS } from '@/lib/plans'
import type { PlanKey } from '@/lib/stripe'

const PLAN_ORDER: string[] = ['lite', 'standard', 'clinic']

export default function BillingClient({
  currentPlan,
  hasPurchasedPlan,
  trialedPlans,
}: {
  currentPlan: string
  hasPurchasedPlan: boolean
  trialedPlans: PlanKey[]
}) {
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
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
      {Object.entries(PLANS).map(([key, plan]) => {
        const isCurrent = key === currentPlan
        const isUpgrade =
          !isCurrent &&
          hasPurchasedPlan &&
          PLAN_ORDER.indexOf(key) > PLAN_ORDER.indexOf(currentPlan)
        const hasTrialed = trialedPlans.includes(key as PlanKey)

        let buttonLabel: string
        if (loading === key) {
          buttonLabel = '処理中...'
        } else if (isCurrent) {
          buttonLabel = '現在のプラン'
        } else if (isUpgrade) {
          buttonLabel = 'アップグレード'
        } else if (hasTrialed) {
          buttonLabel = 'このプランに変更'
        } else {
          buttonLabel = '14日間無料で試す'
        }

        return (
          <div
            key={key}
            className={`bg-white rounded-xl border-2 p-6 ${isCurrent ? 'border-blue-500' : 'border-gray-100'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
              <div className="flex gap-1">
                {isCurrent && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">利用中</span>
                )}
                {!isCurrent && hasTrialed && (
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">体験済み</span>
                )}
              </div>
            </div>
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
            {!isCurrent && hasTrialed && (
              <p className="text-xs text-gray-400 mb-2">※ 無料トライアルは終了しています</p>
            )}
            <button
              onClick={() => handleUpgrade(key)}
              disabled={loading !== null || isCurrent}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isCurrent
                  ? 'bg-gray-100 text-gray-400 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
              }`}
            >
              {buttonLabel}
            </button>
          </div>
        )
      })}
    </div>
  )
}
