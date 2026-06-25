'use client'

import { useState } from 'react'
import type { FormField } from '@/lib/supabase'

export default function PublicFormClient({
  formId,
  fields,
}: {
  formId: string
  fields: FormField[]
}) {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function setValue(fieldId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  function toggleCheckbox(fieldId: string, option: string) {
    const current = (values[fieldId] as string[]) ?? []
    const next = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option]
    setValue(fieldId, next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // 必須チェック
    for (const field of fields) {
      if (!field.required) continue
      const val = values[field.id]
      if (!val || (Array.isArray(val) && val.length === 0) || val === '') {
        setError(`「${field.label}」は必須項目です`)
        return
      }
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId, data: values }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? '送信に失敗しました')
      }
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : '送信に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">送信が完了しました</h2>
        <p className="text-gray-500 text-sm">ご回答いただきありがとうございます。</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field, values[field.id], setValue, toggleCheckbox)}
        </div>
      ))}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? '送信中...' : '送信する'}
      </button>
    </form>
  )
}

function renderField(
  field: FormField,
  value: unknown,
  setValue: (id: string, v: unknown) => void,
  toggleCheckbox: (id: string, option: string) => void
) {
  const base = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  switch (field.type) {
    case 'text':
    case 'phone':
      return (
        <input
          type={field.type === 'phone' ? 'tel' : 'text'}
          value={(value as string) ?? ''}
          onChange={(e) => setValue(field.id, e.target.value)}
          className={base}
          placeholder={field.type === 'phone' ? '000-0000-0000' : ''}
        />
      )
    case 'textarea':
      return (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => setValue(field.id, e.target.value)}
          className={base}
          rows={4}
        />
      )
    case 'date':
      return (
        <input
          type="date"
          value={(value as string) ?? ''}
          onChange={(e) => setValue(field.id, e.target.value)}
          className={base}
        />
      )
    case 'select':
      return (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => setValue(field.id, e.target.value)}
          className={base}
        >
          <option value="">選択してください</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => setValue(field.id, opt)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={((value as string[]) ?? []).includes(opt)}
                onChange={() => toggleCheckbox(field.id, opt)}
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    default:
      return null
  }
}
