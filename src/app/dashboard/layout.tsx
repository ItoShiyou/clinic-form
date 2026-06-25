'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  { href: '/dashboard', label: 'ホーム', icon: '🏠' },
  { href: '/dashboard/forms', label: 'フォーム一覧', icon: '📋' },
  { href: '/dashboard/responses', label: '回答一覧', icon: '📊' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">CF</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">クリニックフォーム</span>
          </div>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-2"
          >
            <span>💳</span> プラン・請求
          </Link>
          <div className="flex items-center gap-2 px-3 py-2">
            <UserButton />
            <span className="text-sm text-gray-600">アカウント</span>
          </div>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
