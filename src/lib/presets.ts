import type { FormField } from './supabase'

export const PRESET_FIELDS: Record<string, Omit<FormField, 'id'>> = {
  patient_name: {
    type: 'text',
    label: 'お名前',
    required: true,
    preset: 'patient_name',
  },
  patient_kana: {
    type: 'text',
    label: 'フリガナ',
    required: true,
    preset: 'patient_kana',
  },
  birth_date: {
    type: 'date',
    label: '生年月日',
    required: true,
    preset: 'birth_date',
  },
  phone: {
    type: 'phone',
    label: '電話番号',
    required: true,
    preset: 'phone',
  },
  gender: {
    type: 'radio',
    label: '性別',
    required: true,
    options: ['男性', '女性', 'その他'],
    preset: 'gender',
  },
  chief_complaint: {
    type: 'textarea',
    label: '主訴（今日はどうされましたか？）',
    required: true,
    preset: 'chief_complaint',
  },
  medical_history: {
    type: 'checkbox',
    label: '既往歴',
    required: false,
    options: ['高血圧', '糖尿病', '心疾患', '脳卒中', '喘息', '腎臓病', '肝臓病', 'がん', 'なし'],
    preset: 'medical_history',
  },
  allergies: {
    type: 'checkbox',
    label: 'アレルギー',
    required: false,
    options: ['薬物アレルギー', '食物アレルギー', 'ラテックスアレルギー', 'なし'],
    preset: 'allergies',
  },
  current_medications: {
    type: 'textarea',
    label: '現在服用中の薬',
    required: false,
    preset: 'current_medications',
  },
  pregnancy: {
    type: 'radio',
    label: '妊娠の可能性',
    required: false,
    options: ['あり', 'なし', '不明', '該当しない'],
    preset: 'pregnancy',
  },
  smoking: {
    type: 'radio',
    label: '喫煙歴',
    required: false,
    options: ['現在喫煙中', '過去に喫煙', '喫煙なし'],
    preset: 'smoking',
  },
}

export const DEPARTMENT_TEMPLATES: Record<string, { name: string; fields: string[] }> = {
  internal: {
    name: '内科',
    fields: ['patient_name', 'patient_kana', 'birth_date', 'phone', 'gender', 'chief_complaint', 'medical_history', 'allergies', 'current_medications'],
  },
  dermatology: {
    name: '皮膚科',
    fields: ['patient_name', 'patient_kana', 'birth_date', 'phone', 'gender', 'chief_complaint', 'allergies', 'current_medications'],
  },
  pediatrics: {
    name: '小児科',
    fields: ['patient_name', 'patient_kana', 'birth_date', 'phone', 'gender', 'chief_complaint', 'medical_history', 'allergies', 'current_medications'],
  },
  orthopedics: {
    name: '整形外科',
    fields: ['patient_name', 'patient_kana', 'birth_date', 'phone', 'gender', 'chief_complaint', 'medical_history', 'current_medications', 'smoking'],
  },
  gynecology: {
    name: '産婦人科',
    fields: ['patient_name', 'patient_kana', 'birth_date', 'phone', 'chief_complaint', 'medical_history', 'allergies', 'current_medications', 'pregnancy'],
  },
}
