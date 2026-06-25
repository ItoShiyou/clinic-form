import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia' as const,
})

export const PLANS = {
  lite: {
    name: 'ライト',
    price: 1980,
    priceId: process.env.STRIPE_LITE_PRICE_ID!,
    maxForms: 3,
    maxResponsesPerMonth: 100,
  },
  standard: {
    name: 'スタンダード',
    price: 3980,
    priceId: process.env.STRIPE_STANDARD_PRICE_ID!,
    maxForms: 10,
    maxResponsesPerMonth: 500,
  },
  clinic: {
    name: 'クリニック',
    price: 7980,
    priceId: process.env.STRIPE_CLINIC_PRICE_ID!,
    maxForms: Infinity,
    maxResponsesPerMonth: Infinity,
  },
} as const

export type PlanKey = keyof typeof PLANS
