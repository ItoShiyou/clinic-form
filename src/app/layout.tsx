import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'クリニックフォーム | クリニック専用スマート問診・予約フォーム',
  description: 'クリニック専用のスマート問診・予約フォームビルダー。医療特化のプリセット項目搭載。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja" className="h-full">
        <body className={`${inter.className} min-h-full`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
