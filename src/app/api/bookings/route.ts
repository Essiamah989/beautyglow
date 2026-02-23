// src/app/api/bookings/route.ts
// Public API — receives booking requests from salon public websites
// Saves to database and will trigger email notification (later)
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_id, service_id, customer_name, customer_phone, customer_email, booking_date, booking_time, notes } = body

    // Get business + owner email
    const { data: business } = await supabase
      .from('businesses')
      .select('business_name, phone, owner_id')
      .eq('id', business_id)
      .single()

    const { data: owner } = await supabase.auth.admin.getUserById(business.owner_id)

    // Get service name
    const { data: service } = await supabase
      .from('services')
      .select('name, price')
      .eq('id', service_id)
      .single()

    // Send email to salon owner
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: owner.user.email!,
      subject: `✦ Nouvelle réservation — ${customer_name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0d0d0d; color: #e8e0d5; padding: 40px;">
          <h1 style="font-size: 1.4rem; font-weight: 400; color: #c9a96e; margin-bottom: 8px;">
            Nouvelle réservation
          </h1>
          <p style="color: #666; font-size: 0.85rem; margin-bottom: 32px;">
            ${business.business_name}
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem; width: 40%;">Client</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 0.9rem;">${customer_name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem;">Téléphone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 0.9rem;">${customer_phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 0.9rem;">${service?.name || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem;">Date</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 0.9rem;">${booking_date}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem;">Heure</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 0.9rem;">${booking_time}</td>
            </tr>
            ${notes ? `
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 0.8rem;">Notes</td>
              <td style="padding: 12px 0; font-size: 0.9rem;">${notes}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 32px; padding: 20px; background: rgba(201,169,110,0.08); border-left: 2px solid #c9a96e;">
            <p style="color: #c9a96e; font-size: 0.8rem; margin: 0;">
              Connectez-vous à votre dashboard pour confirmer cette réservation.
            </p>
          </div>

          <p style="margin-top: 32px; color: #333; font-size: 0.72rem; text-align: center;">
            BeautyGlow — beautyglow.tn
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Email notification failed:', error?.message)
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}