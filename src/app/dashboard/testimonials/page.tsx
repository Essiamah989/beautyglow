import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) redirect("/onboarding");

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*, services(name)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const { data: services } = await supabase
    .from("services")
    .select("id, name")
    .eq("business_id", business.id)
    .eq("is_active", true);

  return (
    <TestimonialsClient
      testimonials={testimonials ?? []}
      services={services ?? []}
      businessId={business.id}
    />
  );
}
