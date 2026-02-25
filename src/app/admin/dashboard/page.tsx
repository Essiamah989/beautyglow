import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

const ADMIN_EMAILS = ["mahmoudiessia989@gmail.com"];

export default async function AdminDashboard() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email!)) {
    redirect("/");
  }

  const [
    { data: businesses },
    { data: expenses },
    { data: recentBookings },
    { count: totalBookings },
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("expenses").select("*").order("date", { ascending: false }),
    supabase
      .from("bookings")
      .select("*, businesses(business_name)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
  ]);

  return (
    <AdminClient
      businesses={businesses || []}
      expenses={expenses || []}
      recentBookings={recentBookings || []}
      totalBookings={totalBookings || 0}
    />
  );
}
