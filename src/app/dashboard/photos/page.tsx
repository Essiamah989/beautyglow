// src/app/dashboard/photos/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import PhotosClient from "./PhotosClient";

export default async function PhotosPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, plan_type")
    .eq("owner_id", user.id)
    .single();

  if (!business) redirect("/onboarding");

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("business_id", business.id)
    .order("display_order", { ascending: true });

  const { data: services } = await supabase
    .from("services")
    .select("id, name")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const { data: beforeAfters } = await supabase
    .from("before_after_photos")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <PhotosClient
      photos={photos ?? []}
      businessId={business.id}
      services={services ?? []}
      beforeAfters={beforeAfters ?? []}
      planType={business.plan_type}
    />
  );
}
