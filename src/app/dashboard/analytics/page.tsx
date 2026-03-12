import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"
import AnalyticsClient from "./AnalyticsClient"

export default async function AnalyticsPage() {
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
  if (!session) redirect("/auth/login")

  const { data: business } = await supabase
    .from("businesses")
    .select("id, plan_type")
    .eq("owner_id", session.user.id)
    .single()

  if (!business) redirect("/onboarding")

  if (business.plan_type === "basic" || business.plan_type === "trial") {
    redirect("/dashboard")
  }

  // Fetch Analytics Data
  // 1. Bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, booking_date, status, service_id")
    .eq("business_id", business.id)

  // 2. Customers
  const { data: customers } = await supabase
    .from("customers")
    .select("id, created_at")
    .eq("business_id", business.id)

  // 3. Services (to calculate revenue and find top services)
  const { data: services } = await supabase
    .from("services")
    .select("id, name, price")
    .eq("business_id", business.id)

  return (
    <AnalyticsClient 
      bookings={bookings || []} 
      customers={customers || []} 
      services={services || []} 
    />
  )
}
