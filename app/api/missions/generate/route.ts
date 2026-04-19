import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { callOpenAI } from '@/lib/openai'
import { MISSION_SYSTEM_PROMPT, buildMissionUserPrompt, MISSION_JSON_SCHEMA } from '@/lib/prompts'
import type { Profile, Mission } from '@/types/index'

const MONTHLY_LIMITS: Record<Profile['subscription_tier'], number | null> = {
  free: 10,
  starter: 30,
  pro: null,
  agency: null,
}

export async function POST() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const user = authResult
  const supabase = await getSupabaseServerClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (!profile?.niche || !profile?.brand_voice) {
    return NextResponse.json(
      { error: 'Please complete your Strategy Hub profile first.' },
      { status: 400 }
    )
  }

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('action', 'generate_plan')
    .gte('created_at', monthStart.toISOString())

  const limit = MONTHLY_LIMITS[profile.subscription_tier]
  if (limit !== null && (count ?? 0) >= limit) {
    return NextResponse.json(
      { error: 'Monthly limit reached.', upgrade: true },
      { status: 402 }
    )
  }

  const aiResponse = await callOpenAI(
    MISSION_SYSTEM_PROMPT,
    buildMissionUserPrompt(profile as {
      niche: string
      brand_voice: string
      content_pillars: string[]
      active_platforms: string[]
      target_audience: string
      audience_pain_points: string[]
    }),
    MISSION_JSON_SCHEMA
  )

  const today = new Date().toISOString().split('T')[0]

  const missionsToInsert = aiResponse.missions.map((m: Omit<Mission, 'id' | 'user_id' | 'status' | 'due_date' | 'created_at'>) => ({
    user_id: user.id,
    title: m.title,
    platform: m.platform,
    format: m.format,
    rationale: m.rationale,
    hook: m.hook,
    cta: m.cta,
    pillar: m.pillar,
    estimated_time: m.estimated_time,
    status: 'pending',
    due_date: today,
  }))

  const { data: missions, error: insertError } = await supabase
    .from('missions')
    .insert(missionsToInsert)
    .select()

  if (insertError) {
    return NextResponse.json({ error: 'Failed to save missions.' }, { status: 500 })
  }

  await supabase
    .from('usage_events')
    .insert({ user_id: user.id, action: 'generate_plan' })

  return NextResponse.json({ missions })
}
