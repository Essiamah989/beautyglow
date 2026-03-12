"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import "@/styles/dashboard.css";

interface Business {
  id: string;
  business_name: string;
  subdomain: string;
  logo_url: string;
  plan_type: string;
  trial_ends_at: string;
}

interface Props {
  business: Business;
  children: React.ReactNode;
}

const allNavItems = [
  { href: "/dashboard",              label: "Vue d'ensemble", icon: "◈" },
  { href: "/dashboard/bookings",     label: "Réservations",   icon: "◎" },
  { href: "/dashboard/services",     label: "Services",       icon: "✦" },
  { href: "/dashboard/photos",       label: "Photos",         icon: "◻" },
  { href: "/dashboard/testimonials", label: "Témoignages",    icon: "❝" },
  { href: "/dashboard/staff",        label: "Équipe",         icon: "👥", requiresPro: true },
  { href: "/dashboard/analytics",    label: "Analytique",     icon: "📈", requiresPro: true },
  { href: "/dashboard/marketing",    label: "Marketing",      icon: "✉",  requiresPro: true },
  { href: "/dashboard/settings",     label: "Paramètres",     icon: "◉" },
];

const domain   = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
const protocol = domain === "localhost:3000" ? "http" : "https";

export default function DashboardLayoutClient({ business, children }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // Must use createBrowserClient (@supabase/ssr) — it manages the
    // auth cookie that Next.js middleware reads. The raw createClient
    // from @supabase/supabase-js only clears in-memory state, leaving
    // the cookie intact so middleware keeps redirecting to the dashboard.
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  const isProOrElite = ["pro", "elite"].includes(business.plan_type);
  const navItems = allNavItems.filter((item) => !item.requiresPro || isProOrElite);

  const currentLabel =
    navItems.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href)
    )?.label || "Dashboard";

  const planLabel =
    business.plan_type === "trial" ? "⏳ Période d'essai"
    : business.plan_type === "pro" ? "★ Plan Pro"
    : business.plan_type === "elite" ? "👑 Plan Elite"
    : "● Plan Basic";

  const isTrialExpired =
    business.plan_type === "trial" &&
    business.trial_ends_at &&
    new Date(business.trial_ends_at) < new Date();

  return (
    <div className="dashboard-wrapper">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="sidebar-logo">
          <Link href="/dashboard" className="sidebar-brand">
            Beauty<span>Glow</span>.tn
          </Link>
          <span className={`sidebar-plan ${business.plan_type}`}>
            {planLabel}
          </span>
        </div>

        <div className="sidebar-salon">
          <div className="sidebar-salon-name">{business.business_name}</div>
          <a
            href={`${protocol}://${business.subdomain}.${domain}`}
            target="_blank"
            className="sidebar-salon-link"
          >
            {business.subdomain}.beautyglow.tn ↗
          </a>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            ← Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="dashboard-main">

        {isTrialExpired && (
          <div style={{ background: '#FEF2F2', borderBottom: '1px solid #FCA5A5', padding: '12px 24px', color: '#991B1B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><strong>Attention :</strong> Votre période d'essai a expiré. Votre site n'est plus accessible au public.</span>
            <button style={{ background: '#DC2626', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>Mettre à niveau</button>
          </div>
        )}

        <div className="topbar">
          <button
            className="mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
          <h1 className="topbar-title">{currentLabel}</h1>
          <div className="topbar-actions">
            <a
              href={`${protocol}://${business.subdomain}.${domain}`}
              target="_blank"
              className="topbar-view-site"
            >
              Voir mon site ↗
            </a>
          </div>
        </div>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}