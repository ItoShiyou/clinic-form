'use client'

import { useState } from 'react'
import { PLANS } from '@/lib/plans'

const PLAN_ORDER: string[] = ['lite', 'standard', 'clinic']

export default function BillingClient({
  currentPlan,
  hasPurchasedPlan,
}: {
  currentPlan: string
  hasPurchasedPlan: boolean
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

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
      else alert('エラーが発生しました')
    } catch {
      alert('エラーが発生しました')
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('エラーが発生しました')
    } catch {
      alert('エラーが発生しました')
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      {/* 解約・管理ボタン（目立つ場所に配置） */}
      {hasPurchasedPlan && (
        <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">サブスクリプションの管理・解約</p>
            <p className="text-xs text-gray-500 mt-0.5">
              支払い方法の変更・領収書の確認・プランの解約はStripeポータルから行えます。
              解約後はすぐに請求が停止します。
            </p>
          </div>
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="shrink-0 px-5 py-2.5 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {portalLoading ? '移動中...' : '解約・管理する'}
          </button>
        </div>
      )}

      {/* プランカード */}
      <h2 className="text-sm font-semibold text-gray-700 mb-4">プランを変更する</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(PLANS).map(([key, plan]) => {
          const isCurrent = key === currentPlan
          const isUpgrade =
            !isCurrent &&
            hasPurchasedPlan &&
            PLAN_ORDER.indexOf(key) > PLAN_ORDER.indexOf(currentPlan)
          const isDowngrade =
            !isCurrent &&
            hasPurchasedPlan &&
            PLAN_ORDER.indexOf(key) < PLAN_ORDER.indexOf(currentPlan)

          let buttonLabel: string
          if (loading === key) {
            buttonLabel = '処理中...'
          } else if (isCurrent) {
            buttonLabel = '現在のプラン'
          } else if (isUpgrade) {
            buttonLabel = 'アップグレード'
          } else if (isDowngrade) {
            buttonLabel = 'ダウングレード（ポータルから）'
          } else {
            buttonLabel = 'このプランに変更'
          }

          return (
            <div
              key={key}
              className={`bg-white rounded-xl border-2 p-6 ${
                isCurrent ? 'border-blue-500' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                {isCurrent && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    利用中
                  </span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ¥{plan.price.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">/月（税抜）</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ フォーム: {plan.maxForms === Infinity ? '無制限' : `${plan.maxForms}個`}</li>
                <li>
                  ✓ 月間回答:{' '}
                  {plan.maxResponsesPerMonth === Infinity
                    ? '無制限'
                    : `${plan.maxResponsesPerMonth}件`}
                </li>
                <li>✓ CSVエクスポート</li>
                <li>✓ メール通知</li>
                <li>✓ QRコード生成</li>
              </ul>
              <button
                onClick={() => {
                  if (isDowngrade) {
                    handlePortal()
                  } else {
                    handleUpgrade(key)
                  }
                }}
                disabled={loading !== null || isCurrent}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : isDowngrade
                    ? 'border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                }`}
              >
                {buttonLabel}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
