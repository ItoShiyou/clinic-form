'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  { href: '/dashboard', label: 'ホーム', icon: '🏠' },
  { href: '/dashboard/forms', label: 'フォーム一覧', icon: '📋' },
  { href: '/dashboard/responses', label: '回答一覧', icon: '📊' },
]

const PLAN_LABELS: Record<string, string> = {
  lite: 'ライト',
  standard: 'スタンダード',
  clinic: 'クリニック',
}

const PLAN_COLORS: Record<string, string> = {
  lite: 'bg-gray-100 text-gray-600',
  standard: 'bg-blue-100 text-blue-700',
  clinic: 'bg-purple-100 text-purple-700',
}

export default function Sidebar({ plan }: { plan: string }) {
  const pathname = usePathname()

  return (
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
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-gray-600">アカウント</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium w-fit ${PLAN_COLORS[plan] ?? PLAN_COLORS.lite}`}>
              {PLAN_LABELS[plan] ?? 'ライト'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
