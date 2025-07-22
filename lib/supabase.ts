import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type User = {
  id: string
  email: string
  username: string
  full_name: string
  level: number
  xp: number
  streak: number
  created_at: string
}

export type Problem = {
  id: string
  title: string
  description: string
  content: string
  difficulty: "Easy" | "Medium" | "Hard"
  topic: string
  xp_reward: number
  time_limit: number
  created_at: string
}

export type UserProgress = {
  id: string
  user_id: string
  problem_id: string
  solved: boolean
  attempts: number
  solution: string
  solved_at?: string
}
