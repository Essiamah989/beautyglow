"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import "@/styles/dashboard.css";

interface Business {
  id: string;
  business_name: string;
  subdomain: string;
  logo_url: string;
  plan_type: string;
}

interface Props {
  business: Business;
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard",              label: "Vue d'ensemble", icon: "◈" },
  { href: "/dashboard/bookings",     label: "Réservations",   icon: "◎" },
  { href: "/dashboard/services",     label: "Services",       icon: "✦" },
  { href: "/dashboard/photos",       label: "Photos",         icon: "◻" },
  { href: "/dashboard/testimonials", label: "Témoignages",    icon: "❝" },
  { href: "/dashboard/settings",     label: "Paramètres",     icon: "◉" },
];

const domain   = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
const protocol = domain === "localhost:3000" ? "http" : "https";

export default function DashboardLayoutClient({ business, children }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  const currentLabel =
    navItems.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href)
    )?.label || "Dashboard";

  return (
    <div className="dashboard-wrapper">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="sidebar-logo">
          <Link href="/dashboard" className="sidebar-brand">
            BeautyGlow
          </Link>
          <span className={`sidebar-plan ${business.plan_type}`}>
            {business.plan_type === "trial"
              ? "⏳ Période d'essai"
              : business.plan_type === "pro"
              ? "★ Plan Pro"
              : "● Plan Basic"}
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

        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}