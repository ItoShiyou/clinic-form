'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useState } from 'react'

const features = [
  {
    icon: '🩺',
    title: '医療プリセット搭載',
    desc: '既往歴・アレルギー・服薬歴など医療特有の問診項目をワンクリックで追加。内科・皮膚科・小児科など診療科別テンプレートも用意。ゼロから作る手間が省けます。',
  },
  {
    icon: '📱',
    title: 'QRコードで即共有',
    desc: '作成したフォームのQRコードを自動生成。待合室に印刷して貼るだけで、患者さんがスマホからすぐに回答できます。紙の問診票が不要に。',
  },
  {
    icon: '📊',
    title: 'CSV一括エクスポート',
    desc: '回答データをCSV形式でワンクリックでエクスポート。Excelや既存のカルテシステムへのデータ連携が簡単にできます。',
  },
  {
    icon: '🔔',
    title: 'リアルタイムメール通知',
    desc: '新しい回答が届くたびに即座にメールでお知らせ。来院前に問診内容を確認しておくことで、診察をスムーズに進められます。',
  },
  {
    icon: '🔒',
    title: '安全なデータ管理',
    desc: '患者情報は暗号化して安全に保管。個人情報保護法に対応した設計で、医療現場のセキュリティ基準を満たします。',
  },
  {
    icon: '⚡',
    title: '5分で作成・公開',
    desc: 'プログラミング知識ゼロでOK。テンプレートを選んで項目を調整するだけで、プロ品質のフォームがすぐに完成します。',
  },
]

const steps = [
  {
    num: '01',
    title: 'テンプレートを選ぶ',
    desc: '診療科に合わせたテンプレートを選択。問診票・予約フォーム・アンケートなど目的別に用意しています。',
  },
  {
    num: '02',
    title: 'フォームをカスタマイズ',
    desc: '項目の追加・削除・並び替えをドラッグ&ドロップで。クリニック独自の質問も簡単に追加できます。',
  },
  {
    num: '03',
    title: 'QRコードを印刷して完了',
    desc: '自動生成されたQRコードを待合室に貼るだけ。当日から患者さんがスマホで回答できます。',
  },
]

const testimonials = [
  {
    name: '田中 圭介 先生',
    role: '内科クリニック 院長',
    comment: '紙の問診票を手書きで転記する作業がなくなり、1日30分以上の時間が浮きました。患者さんにも「スマホで楽に入力できる」と好評です。',
    avatar: '👨‍⚕️',
  },
  {
    name: '山本 さやか 様',
    role: '皮膚科クリニック 受付担当',
    comment: 'Googleフォームを使っていましたが、医療向けの項目が最初から揃っているので設定が圧倒的に楽でした。QRコードもすぐ使えてよかったです。',
    avatar: '👩‍💼',
  },
  {
    name: '鈴木 敏夫 先生',
    role: '小児科クリニック 院長',
    comment: '待合室での感染リスクを減らしたくてペーパーレス化を進めました。患者さんへの共有もQRコード1枚で済むので、スタッフの負担が大幅に減りました。',
    avatar: '👨‍⚕️',
  },
]

const faqs = [
  {
    q: 'IT知識がなくても使えますか？',
    a: 'はい、プログラミングや専門知識は不要です。テンプレートを選んで項目を調整するだけで、5分でフォームが完成します。操作に困った際はサポートにご連絡ください。',
  },
  {
    q: '患者さんのデータはどのように管理されますか？',
    a: '全データは暗号化して安全なクラウド環境に保管されます。個人情報保護法に準拠した設計で、第三者へのデータ提供は一切行いません。',
  },
  {
    q: '無料トライアル後は自動で課金されますか？',
    a: 'トライアル期間中にクレジットカードを登録した場合、終了後に自動で課金が開始されます。不要な場合はトライアル期間中にいつでも解約できます。',
  },
  {
    q: '途中でプランを変更できますか？',
    a: 'はい、いつでもプランのアップグレードができます。ダウングレードや解約もダッシュボードから簡単に行えます。',
  },
  {
    q: '既存のカルテシステムと連携できますか？',
    a: '現在は直接連携機能はありませんが、CSV形式でデータをエクスポートできるため、多くのシステムへのデータ移行が可能です。',
  },
  {
    q: 'スマートフォン非対応の患者さんへの対応は？',
    a: 'フォームはPCやタブレットからも回答可能です。また、紙の問診票との併用も問題ありません。',
  },
]

const plans = [
  {
    key: 'lite',
    name: 'ライト',
    price: '1,980',
    desc: '個人クリニックや開業したばかりの先生に',
    forms: '3個まで',
    responses: '月100件まで',
    highlight: false,
  },
  {
    key: 'standard',
    name: 'スタンダード',
    price: '3,980',
    desc: '複数の問診票・フォームを運用したいクリニックに',
    forms: '10個まで',
    responses: '月500件まで',
    highlight: true,
  },
  {
    key: 'clinic',
    name: 'クリニック',
    price: '7,980',
    desc: '患者数が多い・複数科目を持つクリニックに',
    forms: '無制限',
    responses: '無制限',
    highlight: false,
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100">
      <button
        className="w-full flex items-center justify-between py-5 text-left text-gray-900 font-medium text-sm hover:text-blue-600 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <span className="ml-4 text-lg text-gray-400 flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="pb-5 text-sm text-gray-600 leading-relaxed">{a}</p>}
    </div>
  )
}

export default function HomePage() {
  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ナビゲーション */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CF</span>
            </div>
            <span className="font-bold text-gray-900">クリニックフォーム</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">機能</a>
            <a href="#how" className="hover:text-gray-900 transition-colors">使い方</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">料金</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">よくある質問</a>
          </div>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                ダッシュボード
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  ログイン
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  無料で試す
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="px-6 pt-20 pb-28 bg-gradient-to-b from-blue-50/60 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
            クリニック専用フォームビルダー
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            問診票のペーパーレス化を<br />
            <span className="text-blue-600">5分で実現。</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            医療現場に特化した問診・予約フォームを、誰でも簡単に作成・公開。
            QRコードを待合室に置くだけで、今日から紙の問診票が不要になります。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              14日間無料で試す →
            </Link>
            <a
              href="#how"
              className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-base font-medium hover:bg-gray-50 transition-colors"
            >
              使い方を見る
            </a>
          </div>
          <p className="text-xs text-gray-400">クレジットカード不要 · 14日間完全無料 · いつでも解約可能</p>
        </div>

        {/* ダッシュボードモック */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/80 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 ml-2 border border-gray-200">
                clinic-form.jp/dashboard
              </div>
            </div>
            <div className="flex">
              <div className="w-48 bg-white border-r border-gray-100 p-4 hidden sm:block">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">CF</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">クリニックフォーム</span>
                </div>
                {['🏠 ホーム', '📋 フォーム一覧', '📊 回答一覧'].map((item) => (
                  <div
                    key={item}
                    className={`text-xs px-3 py-2 rounded-lg mb-1 ${
                      item.startsWith('🏠') ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-sm font-bold text-gray-900 mb-4">ダッシュボード</div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[['フォーム数', '4'], ['今月の回答', '128'], ['現在のプラン', 'スタンダード']].map(([label, val]) => (
                    <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="text-xs text-gray-400 mb-1">{label}</div>
                      <div className={`font-bold ${label === '現在のプラン' ? 'text-sm text-blue-600' : 'text-2xl text-gray-900'}`}>{val}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="text-xs font-semibold text-gray-700 mb-3">最新の回答</div>
                  {[['内科問診票', '1分前'], ['初診アンケート', '23分前'], ['予約フォーム', '2時間前']].map(([name, time]) => (
                    <div key={name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-600">{name}</span>
                      <span className="text-xs text-gray-400">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 信頼バッジ */}
      <section className="py-10 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-xs text-gray-400 mb-6">セキュリティ・信頼性</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
            {['🔒 データ暗号化', '🏥 医療現場対応設計', '💳 Stripe決済', '📋 個人情報保護法準拠'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 課題提示 */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-sm font-semibold text-blue-600 mb-4">こんな悩みはありませんか？</p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            紙の問診票・Googleフォームの<br />限界を感じていませんか
          </h2>
          <div className="space-y-4">
            {[
              '手書きの問診票を転記する作業に毎日時間を取られている',
              'Googleフォームは医療向けの項目がなく、毎回ゼロから設定している',
              '患者さんへのフォーム共有方法がなく、紙の問診票を続けている',
              '回答データをExcelにコピーする作業が煩雑',
              '新しい回答が来ても気づくのが遅れることがある',
            ].map((pain) => (
              <div key={pain} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
                <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                <span className="text-sm text-gray-700">{pain}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 text-2xl font-bold text-gray-400">↓</div>
          <p className="text-center mt-4 text-lg font-semibold text-blue-600">
            クリニックフォームが、これらをすべて解決します
          </p>
        </div>
      </section>

      {/* 機能 */}
      <section id="features" className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-semibold text-blue-600 mb-4">機能</p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            クリニック業務に必要な機能が<br />すべて揃っています
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section id="how" className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-semibold text-blue-600 mb-4">使い方</p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            3ステップで今日から使える
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <span className="text-white font-bold text-lg">{s.num}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* お客様の声 */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-semibold text-blue-600 mb-4">お客様の声</p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            導入したクリニックの声
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm text-gray-600 leading-relaxed mb-6">「{t.comment}」</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-blue-600 mb-4">料金プラン</p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            クリニックの規模に合わせて選べる
          </h2>
          <p className="text-center text-gray-500 text-sm mb-16">すべてのプランで14日間無料トライアル。クレジットカード不要。</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.key}
                className={`rounded-2xl p-8 relative ${
                  p.highlight
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    人気 No.1
                  </span>
                )}
                <h3 className={`text-lg font-bold mb-1 ${p.highlight ? 'text-white' : 'text-gray-900'}`}>{p.name}</h3>
                <p className={`text-xs mb-5 ${p.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{p.desc}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${p.highlight ? 'text-white' : 'text-gray-900'}`}>¥{p.price}</span>
                  <span className={`text-sm ml-1 ${p.highlight ? 'text-blue-200' : 'text-gray-400'}`}>/月（税抜）</span>
                </div>
                <ul className={`space-y-3 text-sm mb-8 ${p.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <span className={p.highlight ? 'text-blue-200' : 'text-blue-500'}>✓</span>
                    フォーム作成: {p.forms}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={p.highlight ? 'text-blue-200' : 'text-blue-500'}>✓</span>
                    回答数: {p.responses}
                  </li>
                  {['CSVエクスポート', 'メール通知', 'QRコード生成'].map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <span className={p.highlight ? 'text-blue-200' : 'text-blue-500'}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                    p.highlight
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  無料で試す
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">
            ※ トライアル終了後、自動的に課金が開始されます。トライアル期間中はいつでも解約可能です。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm font-semibold text-blue-600 mb-4">よくある質問</p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">FAQ</h2>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            今日から、紙の問診票を<br />卒業しませんか。
          </h2>
          <p className="text-blue-200 mb-10 text-lg">
            14日間無料。設定5分。クレジットカード不要。
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-colors shadow-xl shadow-blue-800/30"
          >
            無料アカウントを作成する →
          </Link>
          <p className="text-blue-300 text-xs mt-4">いつでもキャンセル可能 · 登録は1分</p>
        </div>
      </section>

      {/* フッター */}
      <footer className="px-6 py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">CF</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">クリニックフォーム</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#features" className="hover:text-gray-600 transition-colors">機能</a>
            <a href="#pricing" className="hover:text-gray-600 transition-colors">料金</a>
            <a href="#faq" className="hover:text-gray-600 transition-colors">FAQ</a>
            <Link href="/legal" className="hover:text-gray-600 transition-colors">特定商取引法に基づく表記</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 クリニックフォーム</p>
        </div>
      </footer>
    </div>
  )
}
