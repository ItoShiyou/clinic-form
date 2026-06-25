'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

export default function HomePage() {
  const { isSignedIn } = useAuth()
  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CF</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">クリニックフォーム</span>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                ダッシュボード
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 text-sm">
                  ログイン
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  無料で始める
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
            クリニック専用
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            問診・予約フォームを
            <br />
            <span className="text-blue-600">5分で作成</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            医療特化のプリセット項目（既往歴・アレルギー・服薬歴）搭載。
            Googleフォームより患者さんに使いやすい、クリニック専用フォームビルダー。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              14日間無料で試す
            </Link>
            <a
              href="#features"
              className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              機能を見る
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">クレジットカード不要 · 14日間無料</p>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            クリニック業務に特化した機能
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: '医療プリセット搭載',
                desc: '既往歴・アレルギー・服薬歴など医療特有の問診項目をワンクリックで追加。内科・皮膚科・小児科など診療科別テンプレートも用意。',
              },
              {
                icon: '📱',
                title: 'QRコードで即共有',
                desc: '作成したフォームのQRコードを自動生成。待合室に貼るだけで患者さんがスマホから回答できます。',
              },
              {
                icon: '📊',
                title: 'CSV一括エクスポート',
                desc: '回答データをExcelで使えるCSV形式でエクスポート。既存の電子カルテシステムへのデータ移行も簡単。',
              },
              {
                icon: '🔔',
                title: 'メール通知',
                desc: '新しい回答が届いたらすぐにメールでお知らせ。回答内容を見落とすことなく、迅速な対応が可能。',
              },
              {
                icon: '🔒',
                title: 'セキュアなデータ管理',
                desc: '患者情報は暗号化して安全に保管。個人情報保護法に対応した設計。',
              },
              {
                icon: '💡',
                title: '直感的な操作',
                desc: 'プログラミング知識不要。ドラッグ&ドロップで誰でも簡単にフォームを作成できます。',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">料金プラン</h2>
          <p className="text-center text-gray-600 mb-16">すべてのプランで14日間無料トライアル</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'ライト',
                price: '1,980',
                forms: '3個まで',
                responses: '月100件まで',
                highlight: false,
              },
              {
                name: 'スタンダード',
                price: '3,980',
                forms: '10個まで',
                responses: '月500件まで',
                highlight: true,
              },
              {
                name: 'クリニック',
                price: '7,980',
                forms: '無制限',
                responses: '無制限',
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border-2 p-8 ${
                  p.highlight ? 'border-blue-600 shadow-lg' : 'border-gray-200'
                }`}
              >
                {p.highlight && (
                  <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full mb-4">
                    人気
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">¥{p.price}</span>
                  <span className="text-gray-500">/月</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                  <li>✓ フォーム作成: {p.forms}</li>
                  <li>✓ 回答数: {p.responses}</li>
                  <li>✓ CSVエクスポート</li>
                  <li>✓ メール通知</li>
                  <li>✓ QRコード生成</li>
                </ul>
                <Link
                  href="/sign-up"
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    p.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  無料で試す
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            今すぐ無料で始めましょう
          </h2>
          <p className="text-blue-100 mb-8">14日間無料。クレジットカード不要。</p>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-colors"
          >
            無料アカウントを作成
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-500">
        <p>© 2025 クリニックフォーム · <a href="/legal" className="hover:underline">特定商取引法に基づく表記</a> · <a href="/privacy" className="hover:underline">プライバシーポリシー</a></p>
      </footer>
    </div>
  )
}
