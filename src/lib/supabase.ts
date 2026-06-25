import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          clerk_user_id: string
          name: string
          plan: 'lite' | 'standard' | 'clinic'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          response_count_this_month: number
          created_at: string
        }
      }
      forms: {
        Row: {
          id: string
          clinic_id: string
          title: string
          description: string | null
          fields: FormField[]
          is_active: boolean
          created_at: string
        }
      }
      responses: {
        Row: {
          id: string
          form_id: string
          clinic_id: string
          data: Record<string, unknown>
          created_at: string
        }
      }
    }
  }
}

export type FormField = {
  id: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'phone'
  label: string
  required: boolean
  options?: string[]
  preset?: string
}
