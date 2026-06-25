'use client'

import { useState } from 'react'
import type { FormField } from '@/lib/supabase'

type Response = {
  id: string
  form_id: string
  formTitle: string
  fields: FormField[]
  data: Record<string, unknown>
  created_at: string
}

export default function ResponsesClient({
  responses,
  forms,
}: {
  responses: Response[]
  forms: { id: string; title: string }[]
}) {
  const [selectedFormId, setSelectedFormId] = useState<string>('all')
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)

  const filtered = selectedFormId === 'all'
    ? responses
    : responses.filter((r) => r.form_id === selectedFormId)

  function exportCSV() {
    const target = filtered
    if (target.length === 0) return

    const allFields = target[0].fields
    const headers = ['回答日時', ...allFields.map((f) => f.label)]
    const rows = target.map((r) => [
      new Date(r.created_at).toLocaleString('ja-JP'),
      ...allFields.map((f) => {
        const val = r.data[f.id]
        return Array.isArray(val) ? val.join('、') : String(val ?? '')
      }),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const bom = '﻿'
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `responses_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <div className="flex gap-6">
      {/* 左: 一覧 */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <select
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">すべてのフォーム</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40 transition-colors"
          >
            CSVエクスポート
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
            <p>回答がありません</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedResponse(r)}
                className={`w-full text-left bg-white rounded-xl border p-4 hover:border-blue-300 transition-colors ${
                  selectedResponse?.id === r.id ? 'border-blue-400 bg-blue-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{r.formTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(r.created_at).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <span className="text-gray-400 text-sm">→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 右: 詳細 */}
      {selectedResponse && (
        <div className="w-80 bg-white rounded-xl border border-gray-100 p-6 h-fit sticky top-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">回答詳細</h3>
            <button onClick={() => setSelectedResponse(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            {new Date(selectedResponse.created_at).toLocaleString('ja-JP')}
          </p>
          <div className="space-y-4">
            {selectedResponse.fields.map((field) => {
              const val = selectedResponse.data[field.id]
              if (!val && val !== 0) return null
              return (
                <div key={field.id}>
                  <p className="text-xs font-medium text-gray-500">{field.label}</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {Array.isArray(val) ? val.join('、') : String(val)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
