export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {[
                {
                  label: '販売事業者名・所在地・電話番号',
                  value: 'ご請求をいただいた場合、遅滞なく書面または電子メールにて開示いたします。お問い合わせは下記メールアドレスまでお願いいたします。',
                },
                { label: 'メールアドレス', value: 'itwoshiyou@gmail.com' },
                { label: 'サービス名', value: 'クリニックフォーム' },
                {
                  label: '販売価格',
                  value: 'ライトプラン：月額1,980円（税込）\nスタンダードプラン：月額3,980円（税込）\nクリニックプラン：月額7,980円（税込）',
                },
                { label: '支払い方法', value: 'クレジットカード（Visa、Mastercard、American Express、JCB）' },
                { label: '支払い時期', value: '毎月自動更新。初回は登録日より14日間の無料トライアル後に課金が開始されます。' },
                { label: 'サービス提供時期', value: 'お申し込み完了後、即時ご利用いただけます。' },
                { label: '返品・キャンセルについて', value: 'サービスの性質上、返金は原則承っておりません。解約はダッシュボードよりいつでも行うことができ、解約後は当月末までご利用いただけます。' },
                { label: '動作環境', value: 'Google Chrome、Safari、Microsoft Edge（最新版推奨）' },
              ].map((row) => (
                <tr key={row.label} className="border-b border-gray-100 last:border-0">
                  <th className="text-left px-6 py-4 font-medium text-gray-700 bg-gray-50 w-48 align-top">
                    {row.label}
                  </th>
                  <td className="px-6 py-4 text-gray-700 whitespace-pre-line">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
