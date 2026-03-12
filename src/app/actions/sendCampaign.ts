"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SegmentParams {
  segment: "all" | "recent" | "inactive" | "test"
  testEmail?: string
}

export async function sendCampaign(subject: string, htmlContent: string, params: SegmentParams) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Non autorisé")

    const { data: business } = await supabase
      .from("businesses")
      .select("id, business_name, plan_type")
      .eq("owner_id", session.user.id)
      .single()

    if (!business) throw new Error("Business non trouvé")

    if (business.plan_type === "basic" || business.plan_type === "trial") {
      throw new Error("Plan Pro ou Elite requis")
    }

    if (params.segment !== "all" && params.segment !== "test" && business.plan_type !== "elite") {
      throw new Error("La segmentation avancée nécessite le plan Elite")
    }

    let targetEmails: string[] = []

    if (params.segment === "test" && params.testEmail) {
      targetEmails = [params.testEmail]
    } else {
      let query = supabase.from("customers").select("email, created_at, latest_booking_date").eq("business_id", business.id).not("email", "is", null)
      
      const { data: customers, error } = await query
      if (error) throw error

      let filteredCustomers = customers || []
      const now = new Date()

      if (params.segment === "recent") {
        filteredCustomers = filteredCustomers.filter(c => {
          const date = c.latest_booking_date ? new Date(c.latest_booking_date) : new Date(c.created_at)
          return (now.getTime() - date.getTime()) <= 30 * 24 * 60 * 60 * 1000 // 30 days
        })
      } else if (params.segment === "inactive") {
        filteredCustomers = filteredCustomers.filter(c => {
          const date = c.latest_booking_date ? new Date(c.latest_booking_date) : new Date(c.created_at)
          return (now.getTime() - date.getTime()) > 90 * 24 * 60 * 60 * 1000 // 90 days
        })
      }

      targetEmails = filteredCustomers.map(c => c.email!)
    }

    // Filter out duplicates and empty strings
    targetEmails = Array.from(new Set(targetEmails)).filter(e => e.trim().length > 0)

    if (targetEmails.length === 0) {
      throw new Error("Aucun destinataire trouvé pour ce segment.")
    }

    // Since Resend free tier might restrict bulk sending to unverified domains,
    // we'll send a single test email if the user is in development or using dummy emails.
    // However, we'll try to batch send up to 50 at a time (Resend limit).
    // Note: this is a basic implementation for demonstration.
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || "BeautyGlow <onboarding@resend.dev>"
    
    const BATCH_SIZE = 50
    for (let i = 0; i < targetEmails.length; i += BATCH_SIZE) {
      const batch = targetEmails.slice(i, i + BATCH_SIZE)
      
      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: batch,
        subject: subject,
        html: htmlContent,
      })
      
      if (sendError) {
        console.error("Resend API error:", sendError)
        throw new Error(`Erreur lors de l'envoi de la campagne: ${sendError.message}`)
      }
    }

    return { success: true, count: targetEmails.length }
  } catch (err: any) {
    console.error("Campaign sending failed:", err)
    return { success: false, error: err.message || "Erreur inattendue" }
  }
}
