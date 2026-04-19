import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { callOpenAI } from '@/lib/openai'
import { REMIX_SYSTEM_PROMPT, buildRemixUserPrompt, REMIX_JSON_SCHEMA } from '@/lib/prompts'
import type { Profile } from '@/types/index'

const MONTHLY_LIMITS: Record<Profile['subscription_tier'], number | null> = {
  free: 3,
  starter: 10,
  pro: null,
  agency: null,
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const user = authResult
  const { seed_content, platforms } = await req.json()

  const supabase = await getSupabaseServerClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('brand_voice, niche, target_audience, subscription_tier')
    .eq('id', user.id)
    .single<Profile>()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found.' }, { status: 400 })
  }

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('action', 'remix')
    .gte('created_at', monthStart.toISOString())

  const limit = MONTHLY_LIMITS[profile.subscription_tier]
  if (limit !== null && (count ?? 0) >= limit) {
    return NextResponse.json(
      { error: 'Remix limit reached.', upgrade: true },
      { status: 402 }
    )
  }

  const aiResponse = await callOpenAI(
    REMIX_SYSTEM_PROMPT,
    buildRemixUserPrompt(seed_content, platforms, {
      brand_voice: profile.brand_voice,
      niche: profile.niche,
      target_audience: profile.target_audience,
    }),
    REMIX_JSON_SCHEMA
  )

  await supabase.from('remix_jobs').insert({
    user_id: user.id,
    seed_content,
    outputs: aiResponse.outputs,
    platforms_used: platforms,
  })

  await supabase.from('usage_events').insert({ user_id: user.id, action: 'remix' })

  return NextResponse.json({ outputs: aiResponse.outputs })
}
