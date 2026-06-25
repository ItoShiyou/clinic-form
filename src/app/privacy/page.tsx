import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← トップページに戻る</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-gray-500 mb-10">最終更新日：2025年1月1日</p>

        <div className="bg-white rounded-xl border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">1. 基本方針</h2>
            <p>
              クリニックフォーム（以下「当サービス」）は、ユーザーの個人情報および患者様の情報の保護を重要な責務と考え、
              個人情報の保護に関する法律（個人情報保護法）をはじめとする関連法令を遵守し、適切に取り扱います。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">2. 収集する情報</h2>
            <p className="mb-2">当サービスは以下の情報を収集します。</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>アカウント登録情報（メールアドレス、クリニック名）</li>
              <li>フォームの回答データ（患者様が入力した問診・アンケート内容）</li>
              <li>サービスの利用状況（フォーム数、回答数等）</li>
              <li>決済情報（クレジットカード情報はStripe社が管理し、当サービスは保持しません）</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">3. 情報の利用目的</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>サービスの提供・運営・改善</li>
              <li>サポートへの対応</li>
              <li>利用料金の請求</li>
              <li>サービスに関する重要なお知らせの送信</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">4. 第三者への提供</h2>
            <p className="mb-2">
              当サービスは、以下の場合を除き、収集した情報を第三者に提供しません。
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく開示が必要な場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
            <p className="mt-3 text-gray-500 text-xs">
              ※ 決済処理にはStripe, Inc.を利用しています。Stripeのプライバシーポリシーは
              <a href="https://stripe.com/jp/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">こちら</a>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">5. データの保管と安全管理</h2>
            <p>
              収集した情報はSupabase（PostgreSQL）によって暗号化された状態で保管されます。
              不正アクセス・漏洩・改ざんを防止するため、適切な技術的・組織的安全管理措置を講じています。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">6. Cookieの使用</h2>
            <p>
              当サービスはログイン状態の維持のためにCookieを使用します。
              ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">7. 個人情報の開示・訂正・削除</h2>
            <p>
              ユーザーは、当サービスが保有する自身の個人情報について、開示・訂正・削除を請求することができます。
              ご要望の際は下記のお問い合わせ先までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">8. 未成年者の利用</h2>
            <p>
              当サービスは医療機関向けのBtoBサービスであり、未成年者の個人利用を想定していません。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">9. プライバシーポリシーの変更</h2>
            <p>
              当サービスは、必要に応じて本ポリシーを変更することがあります。
              重要な変更がある場合はサービス内でお知らせします。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-base mb-3">10. お問い合わせ</h2>
            <p>
              個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
            </p>
            <p className="mt-2">
              メールアドレス：<a href="mailto:itwoshiyou@gmail.com" className="text-blue-600 hover:underline">itwoshiyou@gmail.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
