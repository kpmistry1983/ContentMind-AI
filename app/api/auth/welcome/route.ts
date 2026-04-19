import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, full_name } = await request.json()
    const firstName = (full_name as string)?.split(' ')[0] ?? 'there'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

    await resend.emails.send({
      from: 'ContentMind AI <hello@contentmindai.com>',
      to: email,
      subject: 'Your daily missions start now 🎯',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; background: #f8f9fa;">
          <h1 style="font-family: Manrope, sans-serif; color: #1A1F2E; font-size: 28px;">Welcome to ContentMind AI</h1>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">Hi ${firstName} — your content paralysis ends today.</p>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">Your first step: set up your Strategy Hub so our AI knows your niche, your voice, and who you're creating for. It takes under 2 minutes.</p>
          <a href="${appUrl}/dashboard/strategy" style="display:inline-block; background: linear-gradient(135deg,#4343d5,#5d5fef); color:white; padding:12px 24px; border-radius:12px; text-decoration:none; font-weight:600; margin-top:16px;">
            Set Up My Strategy Hub →
          </a>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 40px;">ContentMind AI</p>
        </div>
      `,
    })
  } catch {
    // fire-and-forget: never surface errors to the caller
  }

  return NextResponse.json({ success: true })
}
