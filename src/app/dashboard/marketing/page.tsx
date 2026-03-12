import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"
import MarketingClient from "./MarketingClient"

export default async function MarketingPage() {
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

  const { count } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id)

  return (
    <MarketingClient 
      totalCustomers={count || 0} 
      planType={business.plan_type} 
    />
  )
}
