// src/app/dashboard/layout.tsx
// Shared dashboard layout — sidebar navigation + top bar
// Wraps all dashboard pages

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    redirect("/onboarding");
  }

  return (
    <DashboardLayoutClient business={business}>
      {children}
    </DashboardLayoutClient>
  );
}
