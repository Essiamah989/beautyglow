// src/app/sites/[subdomain]/page.tsx
// Server component — fetches all data then passes to client component
// Keeps data fetching server-side for performance and SEO

import { createClient } from "@supabase/supabase-js";
import SalonClient from "./SalonClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function SalonPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const { data: businesses } = await supabase
    .from("businesses")
    .select(
      "id, business_name, subdomain, phone, address, description, logo_url, opening_hours, social_links, plan_type, theme, trial_ends_at",
    )
    .eq("subdomain", subdomain)
    .limit(1);

  const business = businesses?.[0] || null;

  if (!business) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#444",
          fontFamily: "serif",
          fontSize: "1.2rem",
        }}
      >
        Salon introuvable
      </div>
    );
  }

  const isTrialExpired =
    business.plan_type === 'trial' &&
    new Date(business.trial_ends_at) < new Date();

  if (isTrialExpired) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#fff",
          fontFamily: "serif",
          padding: "20px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Salon indisponible</h1>
        <p style={{ color: "#aaa", fontSize: "1.1rem" }}>La période d'essai de ce salon a expiré.</p>
      </div>
    );
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("business_id", business.id)
    .order("display_order", { ascending: true });

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("business_id", business.id);

  const { data: beforeAfters } = await supabase
    .from("before_after_photos")
    .select("*")
    .eq("business_id", business.id);

  return (
    <SalonClient
      business={business} // ← theme is inside business object, this is fine
      services={services}
      photos={photos}
      testimonials={testimonials}
      beforeAfters={beforeAfters}
    />
  );
}
