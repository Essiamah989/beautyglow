// src/app/dashboard/DashboardLayoutClient.tsx
// Client component — sidebar navigation with active states

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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
  { href: "/dashboard", label: "Vue d'ensemble", icon: "◈" },
  { href: "/dashboard/bookings", label: "Réservations", icon: "◎" },
  { href: "/dashboard/services", label: "Services", icon: "✦" },
  { href: "/dashboard/photos", label: "Photos", icon: "◻" },
  { href: "/dashboard/testimonials", label: "Témoignages", icon: "❝" },
  { href: "/dashboard/settings", label: "Paramètres", icon: "◉" },
];

export default function DashboardLayoutClient({ business, children }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          background: #080808;
          color: #e8e0d5;
        }

        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #0a0a0a;
          border-right: 1px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
          transition: transform 0.3s ease;
        }

        .sidebar-logo {
          padding: 32px 24px 24px;
          border-bottom: 1px solid #1a1a1a;
        }

        .sidebar-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: #c9a96e;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          display: block;
          margin-bottom: 4px;
        }

        .sidebar-plan {
          font-size: 0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #333;
        }

        .sidebar-plan.pro { color: #c9a96e; opacity: 0.6; }

        .sidebar-salon {
          padding: 20px 24px;
          border-bottom: 1px solid #111;
        }

        .sidebar-salon-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          color: #e8e0d5;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .sidebar-salon-link {
          font-size: 0.7rem;
          color: #444;
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: color 0.2s;
        }

        .sidebar-salon-link:hover { color: #c9a96e; }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          text-decoration: none;
          color: #444;
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.3px;
          transition: all 0.2s;
          position: relative;
        }
          .nav-item {
        font-size: 0.88rem;     /* was 0.82rem */
        }

        .sidebar-salon-name {
        font-size: 1.05rem;     /* was 1rem */
        }

        .nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #c9a96e;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .nav-item:hover {
          color: #888;
          background: rgba(255,255,255,0.02);
        }

        .nav-item.active {
          color: #c9a96e;
          background: rgba(201,169,110,0.05);
        }

        .nav-item.active::before { opacity: 1; }

        .nav-icon {
          font-size: 0.9rem;
          width: 16px;
          text-align: center;
          opacity: 0.7;
        }

        .sidebar-footer {
          padding: 20px 24px;
          border-top: 1px solid #1a1a1a;
        }

        .logout-btn {
          background: none;
          border: none;
          color: #333;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logout-btn:hover { color: #666; }

        /* MAIN CONTENT */
        .dashboard-main {
          margin-left: 260px;
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* TOP BAR */
        .topbar {
          background: #0a0a0a;
          border-bottom: 1px solid #1a1a1a;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .topbar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 400;
          color: #f5f0e8;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .topbar-view-site {
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
          text-decoration: none;
          border: 1px solid #1e1e1e;
          padding: 8px 20px;
          transition: all 0.2s;
        }

        .topbar-view-site:hover {
          border-color: #c9a96e;
          color: #c9a96e;
        }

        /* PAGE CONTENT */
        .dashboard-content {
          flex: 1;
          padding: 40px;
        }

        /* MOBILE MENU TOGGLE */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: #888;
          font-size: 1.2rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .dashboard-main {
            margin-left: 0;
          }
          .mobile-toggle {
            display: block;
          }
          .dashboard-content {
            padding: 24px 16px;
          }
          .topbar {
            padding: 16px 20px;
          }
        }
          .stat-card-value {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3rem;        /* was 2.4rem */
            font-weight: 400;
            color: #c9a96e;
            line-height: 1;
            margin-bottom: 4px;
            }

            .stat-card-label {
            font-size: 0.72rem;     /* was 0.62rem */
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #444;
            margin-bottom: 12px;
            display: block;
            }

            .stat-card-sub {
            font-size: 0.82rem;     /* was 0.72rem */
            color: #333;
            font-weight: 300;
            }

            .bookings-table th {
            font-size: 0.7rem;      /* was 0.6rem */
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #333;
            padding: 12px 16px;
            border-bottom: 1px solid #1a1a1a;
            font-weight: 400;
            }

            .bookings-table td {
            padding: 16px;
            border-bottom: 1px solid #111;
            font-size: 0.92rem;     /* was 0.85rem */
            color: #888;
            font-weight: 300;
            }

            .quick-action {
            font-size: 0.85rem;     /* was 0.78rem */
            letter-spacing: 0.5px;
            }
      `}</style>

      <div className="dashboard-wrapper">
        {/* SIDEBAR */}
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
              href={`http://${business.subdomain}.localhost:3000`}
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

        {/* MAIN */}
        <main className="dashboard-main">
          <div className="topbar">
            <button
              className="mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="topbar-title">
              {navItems.find((item) =>
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href),
              )?.label || "Dashboard"}
            </h1>
            <div className="topbar-actions">
              <a
                href={`http://${business.subdomain}.localhost:3000`}
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
    </>
  );
}
