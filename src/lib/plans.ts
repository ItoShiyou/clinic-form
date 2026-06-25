export const PLANS = {
  lite: {
    name: 'ライト',
    price: 1980,
    maxForms: 3,
    maxResponsesPerMonth: 100,
  },
  standard: {
    name: 'スタンダード',
    price: 3980,
    maxForms: 10,
    maxResponsesPerMonth: 500,
  },
  clinic: {
    name: 'クリニック',
    price: 7980,
    maxForms: Infinity,
    maxResponsesPerMonth: Infinity,
  },
} as const

export type PlanKey = keyof typeof PLANS
