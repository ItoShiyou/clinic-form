# セットアップ手順（あなたがやること）

## 所要時間：約2〜3時間

---

## ステップ1：Supabaseのセットアップ（30分）

1. https://supabase.com でアカウント作成（GitHubでOK）
2. 「New project」でプロジェクト作成
3. 「SQL Editor」を開き、`supabase_schema.sql` の内容を貼り付けて実行
4. 「Project Settings」→「API」から以下を`.env.local`にコピー：
   - `NEXT_PUBLIC_SUPABASE_URL`（Project URL）
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（anon public）
   - `SUPABASE_SERVICE_ROLE_KEY`（service_role）

---

## ステップ2：Clerkのセットアップ（20分）

1. https://clerk.com でアカウント作成
2. 「Create application」でアプリ作成
3. 「API Keys」から以下を`.env.local`にコピー：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

---

## ステップ3：Stripeのセットアップ（40分）

1. https://stripe.com でアカウント作成
2. 銀行口座を登録（振込先として使用）
3. 「商品」→「料金プラン」で3つのプランを作成：
   - ライトプラン：1,980円/月
   - スタンダードプラン：3,980円/月
   - クリニックプラン：7,980円/月
4. 各プランの「料金ID」（`price_xxxx`）を`.env.local`にコピー
5. 「開発者」→「APIキー」から以下をコピー：
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

---

## ステップ4：Resendのセットアップ（10分）

1. https://resend.com でアカウント作成
2. 「API Keys」で新しいキーを作成
3. `RESEND_API_KEY`に入力

---

## ステップ5：Vercelへデプロイ（20分）

1. https://vercel.com でアカウント作成（GitHubでOK）
2. このフォルダをGitHubにプッシュ：
   ```
   git init
   git add .
   git commit -m "initial commit"
   gh repo create clinic-form --public --push
   ```
3. Vercelで「Import Project」→GitHubリポジトリを選択
4. 「Environment Variables」に`.env.local`の内容をすべて入力
5. `NEXT_PUBLIC_APP_URL`を本番URLに変更（例：`https://clinic-form.vercel.app`）
6. デプロイ実行

---

## ステップ6：StripeのWebhook設定（10分）

1. Stripe「開発者」→「Webhooks」→「エンドポイントを追加」
2. URL：`https://あなたのドメイン/api/webhooks/stripe`
3. イベント：`customer.subscription.*` を選択
4. 「署名シークレット」を`STRIPE_WEBHOOK_SECRET`にコピー
5. Vercelの環境変数を更新して再デプロイ

---

## ステップ7：特商法表記の公開（10分）

`/legal`ページに以下を記載：
- 販売事業者名
- 代表者名
- 所在地
- 電話番号
- メールアドレス
- 販売価格（各プランの料金）
- 支払い方法
- 解約・返金ポリシー

---

## 月次作業（自動化推奨）

Supabaseの「Database」→「Cron Jobs」で毎月1日に実行：
```sql
UPDATE clinics SET response_count_this_month = 0;
```
