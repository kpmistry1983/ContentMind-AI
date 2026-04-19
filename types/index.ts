export interface Profile {
  id: string
  full_name: string | null
  niche: string | null
  brand_voice: 'empathetic' | 'strategic' | 'minimalist' | 'authoritative' | 'clear' | null
  target_audience: string | null
  audience_pain_points: string[]
  content_pillars: string[]
  active_platforms: string[]
  subscription_tier: 'free' | 'starter' | 'pro' | 'agency'
  stripe_customer_id: string | null
  stripe_sub_id: string | null
  created_at: string
}

export interface Mission {
  id: string
  user_id: string
  title: string
  platform: string
  format: string | null
  rationale: string | null
  hook: string | null
  cta: string | null
  pillar: string | null
  estimated_time: string | null
  status: 'pending' | 'in_progress' | 'done' | 'dismissed'
  due_date: string
  created_at: string
}

export interface RemixJob {
  id: string
  user_id: string
  seed_content: string
  outputs: RemixOutput[] | null
  platforms_used: string[]
  created_at: string
}

export interface RemixOutput {
  platform: string
  content: string
  char_count: number
  angle: string
  formatting_notes: string
}

export interface UsageLimits {
  missions: { used: number; limit: number | null; unlimited: boolean }
  remixes: { used: number; limit: number | null; unlimited: boolean }
}
