import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  full_name: string | null
  telegram_chat_id: number | null
  telegram_link_code: string | null
  created_at: string
}

export type Agent = {
  id: string
  user_id: string
  name: string
  role: string
  model: string
  system_prompt: string
  is_chief: boolean
  status: 'idle' | 'running' | 'paused'
  autonomy: number
  avatar_emoji: string
  created_at: string
}

export type Task = {
  id: string
  user_id: string
  agent_id: string | null
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'queued' | 'running' | 'done' | 'failed'
  created_at: string
  completed_at: string | null
}

export type ChiefMessage = {
  id: string
  user_id: string
  direction: 'in' | 'out'
  text: string
  telegram_message_id: number | null
  created_at: string
}

export type Note = {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export type CalendarEvent = {
  id: string
  user_id: string
  title: string
  description: string | null
  starts_at: string
  ends_at: string | null
  all_day: boolean
  color: string
  created_at: string
}
