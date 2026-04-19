import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Mission } from '@/types/index'

type Params = { params: Promise<{ id: string }> }

async function fetchOwnedMission(userId: string, missionId: string) {
  const supabase = await getSupabaseServerClient()
  const { data: mission } = await supabase
    .from('missions')
    .select('*')
    .eq('id', missionId)
    .single<Mission>()

  return { supabase, mission }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult
  const user = authResult

  const { id } = await params
  const { supabase, mission } = await fetchOwnedMission(user.id, id)

  if (!mission) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }
  if (mission.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const body = await req.json()
  const status: Mission['status'] = body.status

  const { data: updated, error } = await supabase
    .from('missions')
    .update({ status })
    .eq('id', id)
    .select()
    .single<Mission>()

  if (error) {
    return NextResponse.json({ error: 'Failed to update mission.' }, { status: 500 })
  }

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult
  const user = authResult

  const { id } = await params
  const { supabase, mission } = await fetchOwnedMission(user.id, id)

  if (!mission) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }
  if (mission.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { error } = await supabase.from('missions').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete mission.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
