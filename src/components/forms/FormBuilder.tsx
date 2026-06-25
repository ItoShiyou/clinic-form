'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PRESET_FIELDS, DEPARTMENT_TEMPLATES } from '@/lib/presets'
import type { FormField } from '@/lib/supabase'

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function SortableField({
  field,
  onUpdate,
  onRemove,
}: {
  field: FormField
  onUpdate: (field: FormField) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const [expanded, setExpanded] = useState(false)

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing">
          ⠿
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{fieldTypeLabel(field.type)}</span>
            <span className="font-medium text-sm text-gray-900">{field.label}</span>
            {field.required && <span className="text-red-500 text-xs">必須</span>}
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 text-sm">
          {expanded ? '▲' : '▼'}
        </button>
        <button onClick={() => onRemove(field.id)} className="text-red-400 hover:text-red-600 text-sm">
          ✕
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ラベル（質問文）</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate({ ...field, label: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`req-${field.id}`}
              checked={field.required}
              onChange={(e) => onUpdate({ ...field, required: e.target.checked })}
              className="rounded"
            />
            <label htmlFor={`req-${field.id}`} className="text-sm text-gray-700">必須項目にする</label>
          </div>
          {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">選択肢（1行に1つ）</label>
              <textarea
                value={field.options?.join('\n') ?? ''}
                onChange={(e) => onUpdate({ ...field, options: e.target.value.split('\n').filter(Boolean) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                rows={4}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function fieldTypeLabel(type: FormField['type']) {
  const map: Record<FormField['type'], string> = {
    text: 'テキスト',
    textarea: '複数行',
    select: 'プルダウン',
    checkbox: 'チェックボックス',
    radio: 'ラジオボタン',
    date: '日付',
    phone: '電話番号',
  }
  return map[type]
}

const FIELD_TYPES: { type: FormField['type']; label: string }[] = [
  { type: 'text', label: 'テキスト（1行）' },
  { type: 'textarea', label: 'テキスト（複数行）' },
  { type: 'radio', label: 'ラジオボタン' },
  { type: 'checkbox', label: 'チェックボックス' },
  { type: 'select', label: 'プルダウン' },
  { type: 'date', label: '日付' },
  { type: 'phone', label: '電話番号' },
]

export default function FormBuilder({
  initialTitle = '',
  initialDescription = '',
  initialFields = [],
  formId,
}: {
  initialTitle?: string
  initialDescription?: string
  initialFields?: FormField[]
  formId?: string
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function addPresetField(presetKey: string) {
    const preset = PRESET_FIELDS[presetKey]
    if (!preset) return
    setFields((prev) => [...prev, { ...preset, id: generateId() }])
  }

  function addFromTemplate(templateKey: string) {
    const template = DEPARTMENT_TEMPLATES[templateKey]
    if (!template) return
    const newFields = template.fields.map((key) => ({
      ...PRESET_FIELDS[key],
      id: generateId(),
    }))
    setFields(newFields)
  }

  function addCustomField(type: FormField['type']) {
    const newField: FormField = {
      id: generateId(),
      type,
      label: fieldTypeLabel(type),
      required: false,
      options: (type === 'select' || type === 'checkbox' || type === 'radio') ? ['選択肢1', '選択肢2'] : undefined,
    }
    setFields((prev) => [...prev, newField])
  }

  function updateField(updated: FormField) {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  async function handleSave() {
    if (!title.trim()) return alert('フォームのタイトルを入力してください')
    if (fields.length === 0) return alert('項目を1つ以上追加してください')

    setSaving(true)
    try {
      const res = await fetch(formId ? `/api/forms/${formId}` : '/api/forms', {
        method: formId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, fields }),
      })
      if (!res.ok) throw new Error('保存に失敗しました')
      const data = await res.json()
      router.push(`/dashboard/forms/${data.id}/qr`)
    } catch (e) {
      alert(e instanceof Error ? e.message : '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* 左パネル: フィールド追加 */}
      <div className="w-72 bg-white border-r border-gray-100 overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'presets' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
            >
              医療プリセット
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'custom' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
            >
              カスタム追加
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'presets' ? (
            <>
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">診療科別テンプレート</p>
                <div className="space-y-1">
                  {Object.entries(DEPARTMENT_TEMPLATES).map(([key, tmpl]) => (
                    <button
                      key={key}
                      onClick={() => addFromTemplate(key)}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-gray-700 transition-colors"
                    >
                      📋 {tmpl.name}テンプレート
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">個別プリセット項目</p>
                <div className="space-y-1">
                  {Object.entries(PRESET_FIELDS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => addPresetField(key)}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-gray-500 mb-2">フィールドタイプ</p>
              <div className="space-y-1">
                {FIELD_TYPES.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => addCustomField(type)}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    + {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 右パネル: フォーム編集 */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          {/* タイトル・説明 */}
          <div className="mb-6 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="フォームのタイトル"
              className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-2 bg-transparent"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明文（任意）"
              className="w-full text-gray-500 border-0 border-b border-gray-100 focus:border-blue-300 outline-none pb-2 bg-transparent text-sm"
            />
          </div>

          {/* フィールド一覧 */}
          {fields.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 text-center text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">左のパネルから項目を追加してください</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onUpdate={updateField}
                      onRemove={removeField}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* 保存ボタン */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? '保存中...' : formId ? '変更を保存' : 'フォームを作成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
