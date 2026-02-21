// src/app/dashboard/bookings/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
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

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, services(name, price)")
    .eq("business_id", business.id)
    .order("booking_date", { ascending: false });

  // Log to debug
  console.log("Business ID:", business.id);
  console.log("Bookings count:", bookings?.length);
  console.log("Error:", error);

  return <BookingsClient bookings={bookings ?? []} businessId={business.id} />;
}
