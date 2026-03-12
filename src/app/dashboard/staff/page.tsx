import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"
import StaffClient from "./StaffClient"

export default async function StaffPage() {
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
    // Wait, the plan check should block it, or maybe just render an upgrade banner?
    // Let's redirect to dashboard if they don't have access.
    redirect("/dashboard")
  }

  const { data: staffMembers } = await supabase
    .from("staff")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false })

  return (
    <StaffClient 
      initialStaff={staffMembers || []} 
      businessId={business.id} 
      planType={business.plan_type} 
    />
  )
}
