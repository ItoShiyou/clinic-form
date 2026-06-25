'use client'

import { useState } from 'react'

const PLANS = [
  {
    key: 'lite',
    name: 'ライト',
    price: '1,980',
    desc: '個人クリニックや開業したばかりの先生に',
    forms: '3個まで',
    responses: '月100件まで',
  },
  {
    key: 'standard',
    name: 'スタンダード',
    price: '3,980',
    desc: '複数の問診票・フォームを運用したいクリニックに',
    forms: '10個まで',
    responses: '月500件まで',
    popular: true,
  },
  {
    key: 'clinic',
    name: 'クリニック',
    price: '7,980',
    desc: '患者数が多い・複数科目を持つクリニックに',
    forms: '無制限',
    responses: '無制限',
  },
]

export default function OnboardingPlanPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSelect(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, isOnboarding: true }),
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      {/* ヘッダー */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">CF</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">プランを選択してください</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          どのプランも<span className="font-semibold text-gray-700">14日間無料</span>でお試しいただけます。
          トライアル終了後は選択したプランで自動的に課金が始まります。
        </p>
      </div>

      {/* トライアル説明バナー */}
      <div className="w-full max-w-3xl mb-8 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">📅 14日間無料トライアルについて</p>
        <ul className="text-xs space-y-1 text-blue-700">
          <li>・ トライアルはアカウントにつき1回のみご利用いただけます</li>
          <li>・ トライアル期間中はいつでも解約できます（解約後は即時終了）</li>
          <li>・ 期間終了後は選択したプランで自動的に月額課金が開始されます</li>
          <li>・ クレジットカード情報はStripeにより安全に管理されます</li>
        </ul>
      </div>

      {/* プランカード */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-3xl">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`bg-white rounded-2xl border-2 p-6 flex flex-col relative ${
              plan.popular ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-100'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                人気 No.1
              </span>
            )}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{plan.desc}</p>
            </div>
            <div className="mb-5">
              <span className="text-3xl font-bold text-gray-900">¥{plan.price}</span>
              <span className="text-gray-400 text-sm">/月（税抜）</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> フォーム: {plan.forms}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">✓</span> 月間回答: {plan.responses}
              </li>
              {['CSVエクスポート', 'メール通知', 'QRコード生成'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect(plan.key)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {loading === plan.key ? '処理中...' : `${plan.name}で14日間無料で試す`}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        クレジットカード情報はこの後のStripe画面で入力します。
        トライアル期間中は請求されません。
      </p>
    </div>
  )
}
