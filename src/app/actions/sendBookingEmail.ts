'use server'

import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function sendBookingEmail(data: {
  business_id: string
  service_id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  booking_date: string
  booking_time: string
}) {
  try {
    const { data: business } = await supabase
      .from('businesses')
      .select('business_name, owner_id, plan_type')
      .eq('id', data.business_id)
      .single()

    if (!business) return  // ← null check

    const { data: owner } = await supabase.auth.admin
      .getUserById(business.owner_id)  // ← now safe

    if (!owner?.user) return  // ← null check

    const { data: service } = await supabase
      .from('services')
      .select('name, price')
      .eq('id', data.service_id)
      .single()

    await resend.emails.send({
      from: 'BeautyGlow <onboarding@resend.dev>',
      to: 'mahmoudiessia989@gmail.com',
      subject: `✦ Nouvelle réservation — ${data.customer_name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #0d0d0d; color: #e8e0d5; padding: 40px;">
          <h1 style="font-size: 1.4rem; font-weight: 400; color: #c9a96e; margin-bottom: 8px;">Nouvelle réservation</h1>
          <p style="color: #666; font-size: 0.85rem; margin-bottom: 32px;">${business.business_name}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem; width: 40%;">Client</td><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a;">${data.customer_name}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem;">Téléphone</td><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a;">${data.customer_phone}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem;">Service</td><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a;">${service?.name || '—'}</td></tr>
            <tr><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #666; font-size: 0.8rem;">Date</td><td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a;">${data.booking_date}</td></tr>
            <tr><td style="padding: 12px 0; color: #666; font-size: 0.8rem;">Heure</td><td style="padding: 12px 0;">${data.booking_time}</td></tr>
          </table>
          <p style="margin-top: 32px; color: #333; font-size: 0.72rem; text-align: center;">BeautyGlow — beautyglow.tn</p>
        </div>
      `
    })

    // Customer confirmation email (Pro/Elite plan only)
    if (data.customer_email && ['pro', 'elite'].includes(business.plan_type)) {
      await resend.emails.send({
        from: 'BeautyGlow <onboarding@resend.dev>',
        to: data.customer_email,
        subject: `Confirmation de votre rendez-vous — ${business.business_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #fcfcfc; padding: 24px; text-align: center; border-bottom: 1px solid #eaeaea;">
              <h1 style="font-size: 1.4rem; margin: 0; color: #111;">${business.business_name}</h1>
            </div>
            <div style="padding: 32px 24px;">
              <p style="margin-top: 0; font-size: 1.05rem; color: #222;">Bonjour <strong>${data.customer_name}</strong>,</p>
              <p style="font-size: 0.95rem; line-height: 1.6; color: #555;">
                Votre demande de réservation pour <strong>${service?.name || 'ce service'}</strong> a bien été enregistrée et transmise au salon.
              </p>
              <div style="background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin: 28px 0;">
                <p style="margin: 0 0 12px 0; font-size: 0.95rem;"><strong>🗓 Date :</strong> ${data.booking_date}</p>
                <p style="margin: 0; font-size: 0.95rem;"><strong>⏰ Heure :</strong> ${data.booking_time}</p>
              </div>
              <p style="font-size: 0.95rem; color: #666; margin-bottom: 0;">
                À très bientôt !<br>L'équipe ${business.business_name}
              </p>
            </div>
            <div style="background-color: #fafafa; padding: 16px; text-align: center; border-top: 1px solid #eaeaea; font-size: 0.75rem; color: #999;">
              Propulsé par BeautyGlow
            </div>
          </div>
        `
      })
    }
  } catch (err: any) {
    console.error('Email failed:', err?.message)
  }
}