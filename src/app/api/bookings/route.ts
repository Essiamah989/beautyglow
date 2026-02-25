import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: business } = await supabase
      .from('businesses')
      .select('business_name, owner_id')
      .eq('id', body.business_id)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    const { data: owner } = await supabase.auth.admin
      .getUserById(business.owner_id)

    if (!owner?.user) return NextResponse.json({ error: 'Owner not found' }, { status: 404 })

    // Get service name
    const { data: service } = await supabase
      .from('services')
      .select('name')
      .eq('id', body.service_id)
      .single()

    await resend.emails.send({
      from: 'BeautyGlow <onboarding@resend.dev>',
      to: 'mahmoudiessia989@gmail.com',
      subject: `✦ Nouvelle réservation — ${body.customer_name}`,
      html: `<p>Nouvelle réservation de ${body.customer_name} pour ${service?.name || '—'} le ${body.booking_date} à ${body.booking_time}</p>`
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Booking notification failed:', error?.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}