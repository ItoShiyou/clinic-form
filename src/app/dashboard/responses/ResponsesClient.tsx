'use client'

import { useState } from 'react'
import type { FormField } from '@/lib/supabase'

type Status = 'unchecked' | 'checked' | 'in_progress' | 'done'

type Response = {
  id: string
  form_id: string
  formTitle: string
  fields: FormField[]
  data: Record<string, unknown>
  status: Status
  created_at: string
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; next: Status }> = {
  unchecked:   { label: '未確認',  color: 'bg-gray-100 text-gray-600',    next: 'checked' },
  checked:     { label: '確認済み', color: 'bg-blue-100 text-blue-700',    next: 'in_progress' },
  in_progress: { label: '対応中',  color: 'bg-yellow-100 text-yellow-700', next: 'done' },
  done:        { label: '完了',    color: 'bg-green-100 text-green-700',   next: 'unchecked' },
}

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as Status[]

export default function ResponsesClient({
  responses: initialResponses,
  forms,
}: {
  responses: Response[]
  forms: { id: string; title: string }[]
}) {
  const [responses, setResponses] = useState(initialResponses)
  const [selectedFormId, setSelectedFormId] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [bulkStatus, setBulkStatus] = useState<Status>('checked')

  const filtered = responses.filter((r) => {
    if (selectedFormId !== 'all' && r.form_id !== selectedFormId) return false
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false
    return true
  })

  async function updateStatus(responseId: string, status: Status) {
    await fetch(`/api/responses/${responseId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setResponses((prev) => prev.map((r) => r.id === responseId ? { ...r, status } : r))
    setSelectedResponse((prev) => prev?.id === responseId ? { ...prev, status } : prev)
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)))
    }
  }

  async function applyBulkStatus() {
    await Promise.all([...selectedIds].map((id) => updateStatus(id, bulkStatus)))
    setSelectedIds(new Set())
  }

  function exportCSV() {
    const target = filtered
    if (target.length === 0) return
    const allFields = target[0].fields
    const headers = ['回答日時', 'ステータス', ...allFields.map((f) => f.label)]
    const rows = target.map((r) => [
      new Date(r.created_at).toLocaleString('ja-JP'),
      STATUS_CONFIG[r.status]?.label ?? r.status,
      ...allFields.map((f) => {
        const val = r.data[f.id]
        return Array.isArray(val) ? val.join('、') : String(val ?? '')
      }),
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `responses_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <div className="flex gap-6">
      {/* 左: 一覧 */}
      <div className="flex-1 min-w-0">
        {/* フィルター */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <select
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">すべてのフォーム</option>
            {forms.map((f) => <option key={f.id} value={f.id}>{f.title}</option>)}
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              すべて
            </button>
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedStatus === s ? STATUS_CONFIG[s].color + ' ring-2 ring-offset-1 ring-current' : STATUS_CONFIG[s].color + ' opacity-60 hover:opacity-100'}`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="ml-auto bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-40"
          >
            CSVエクスポート
          </button>
        </div>

        {/* 一括操作 */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 mb-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <span className="text-sm text-blue-700 font-medium">{selectedIds.size}件選択中</span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as Status)}
              className="border border-blue-200 rounded-lg px-2 py-1 text-sm ml-2"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
            <button
              onClick={applyBulkStatus}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
            >
              一括変更
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-blue-500 text-sm hover:underline ml-auto"
            >
              選択解除
            </button>
          </div>
        )}

        {/* テーブル */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
            <p>回答がありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* ヘッダー */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-2 border-b border-gray-100 bg-gray-50">
              <input
                type="checkbox"
                checked={selectedIds.size === filtered.length && filtered.length > 0}
                onChange={toggleAll}
                className="rounded"
              />
              <span className="text-xs font-medium text-gray-500">患者・フォーム</span>
              <span className="text-xs font-medium text-gray-500">日時</span>
              <span className="text-xs font-medium text-gray-500">ステータス</span>
            </div>

            {filtered.map((r) => {
              const nameField = r.fields.find((f) => f.preset === 'patient_name')
              const patientName = nameField ? String(r.data[nameField.id] ?? '') : ''
              const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.unchecked

              return (
                <div
                  key={r.id}
                  className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${selectedResponse?.id === r.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedResponse(r)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(r.id)}
                    onChange={(e) => { e.stopPropagation(); toggleSelect(r.id) }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {patientName || '（名前なし）'}
                    </p>
                    <p className="text-xs text-gray-400">{r.formTitle}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString('ja-JP')}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateStatus(r.id, STATUS_CONFIG[r.status]?.next ?? 'checked') }}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${cfg.color}`}
                  >
                    {cfg.label}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 右: 詳細 */}
      {selectedResponse && (
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">回答詳細</h3>
              <button onClick={() => setSelectedResponse(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>

            {/* ステータス変更 */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1.5">ステータス</p>
              <div className="flex flex-wrap gap-1">
                {ALL_STATUSES.map((s) => {
                  const cfg = STATUS_CONFIG[s]
                  const isActive = selectedResponse.status === s
                  return (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedResponse.id, s)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${cfg.color} ${isActive ? 'ring-2 ring-offset-1 ring-current' : 'opacity-50 hover:opacity-100'}`}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              {new Date(selectedResponse.created_at).toLocaleString('ja-JP')}
            </p>

            <div className="space-y-3">
              {selectedResponse.fields.map((field) => {
                const val = selectedResponse.data[field.id]
                if (!val && val !== 0) return null
                return (
                  <div key={field.id} className="border-b border-gray-50 pb-3 last:border-0">
                    <p className="text-xs font-medium text-gray-500">{field.label}</p>
                    <p className="text-sm text-gray-900 mt-0.5">
                      {Array.isArray(val) ? val.join('、') : String(val)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
