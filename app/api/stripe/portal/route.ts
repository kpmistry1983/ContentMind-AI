import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAuth } from '@/lib/auth'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/index'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const authResult = await requireAuth()
  if (authResult instanceof NextResponse) return authResult

  const user = authResult
  const supabase = await getSupabaseServerClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single<Pick<Profile, 'stripe_customer_id'>>()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found.' }, { status: 400 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })

  return NextResponse.json({ url: session.url })
}
