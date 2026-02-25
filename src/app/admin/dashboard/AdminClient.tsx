"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface Business {
  id: string;
  business_name: string;
  subdomain: string;
  plan_type: string;
  trial_ends_at: string;
  created_at: string;
  owner_id: string;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  notes: string;
}

export default function AdminClient({
  businesses,
  expenses,
  recentBookings,
  totalBookings,
}: {
  businesses: Business[];
  expenses: Expense[];
  recentBookings: any[];
  totalBookings: number;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "salons" | "financial" | "bookings"
  >("overview");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "infrastructure",
    description: "",
    amount: "",
    notes: "",
  });
  const [localExpenses, setLocalExpenses] = useState(expenses);

  // Add this at the top of the component:
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // CALCULATIONS
  const trialSalons = businesses.filter((b) => b.plan_type === "trial");
  const basicSalons = businesses.filter((b) => b.plan_type === "basic");
  const proSalons = businesses.filter((b) => b.plan_type === "pro");
  const activeSalons = [...basicSalons, ...proSalons];
  const mrr = basicSalons.length * 89 + proSalons.length * 149;

  const now = new Date();
  const expiredTrials = trialSalons.filter(
    (b) => new Date(b.trial_ends_at) < now,
  );
  const activeTrials = trialSalons.filter(
    (b) => new Date(b.trial_ends_at) >= now,
  );

  const thisMonthExpenses = localExpenses
    .filter((e) => e.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalExpenses = localExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0,
  );
  const netProfit = mrr - thisMonthExpenses;
  const grossMargin =
    mrr > 0 ? (((mrr - thisMonthExpenses) / mrr) * 100).toFixed(1) : "0";

  // This month signups
  const thisMonth = new Date().toISOString().slice(0, 7);
  const newThisMonth = businesses.filter((b) =>
    b.created_at.startsWith(thisMonth),
  );

  const handleAddExpense = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        date: expenseForm.date,
        category: expenseForm.category,
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        notes: expenseForm.notes || null,
      })
      .select()
      .single();

    if (!error && data) {
      setLocalExpenses([data, ...localExpenses]);
      setShowExpenseForm(false);
      setExpenseForm({
        date: new Date().toISOString().split("T")[0],
        category: "infrastructure",
        description: "",
        amount: "",
        notes: "",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    await supabase.from("expenses").delete().eq("id", id);
    setLocalExpenses(localExpenses.filter((e) => e.id !== id));
  };

  // Add this helper function inside the component (before return):
  const fmt = (n: number) => (mounted ? n.toLocaleString() : n.toString());

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --gold: #b8934a;
          --pink: #e07aa0;
          --pink-light: #fce4ef;
          --sky: #4a90b8;
          --sky-light: #e8f4fa;
          --dark: #0d0d0d;
          --dark-2: #111;
          --dark-3: #1a1a1a;
          --text: #e8e0d5;
          --text-muted: #666;
          --border: #1a1a1a;
          --green: #4caf8a;
          --red: #e07070;
        }

        body {
          background: var(--dark);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          min-height: 100vh;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
          width: 240px;
          background: var(--dark-2);
          border-right: 1px solid var(--border);
          padding: 32px 0;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
        }

        .sidebar-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          color: var(--gold);
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 0 24px 32px;
          border-bottom: 1px solid var(--border);
          display: block;
        }

        .sidebar-label {
          font-size: 0.55rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 24px 24px 8px;
          display: block;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          font-size: 0.78rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          letter-spacing: 0.5px;
        }

        .sidebar-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }
        .sidebar-item.active { color: var(--gold); background: rgba(184,147,74,0.06); border-left: 2px solid var(--gold); }

        .sidebar-icon { font-size: 0.9rem; width: 16px; }

        .sidebar-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          border-top: 1px solid var(--border);
        }

        .sidebar-badge {
          font-size: 0.6rem;
          letter-spacing: 1px;
          background: rgba(224,122,160,0.1);
          color: var(--pink);
          border: 1px solid rgba(224,122,160,0.2);
          padding: 4px 10px;
          border-radius: 2px;
          text-transform: uppercase;
        }

        /* MAIN */
        .main {
          margin-left: 240px;
          flex: 1;
          padding: 40px;
          max-width: calc(100vw - 240px);
        }

        .page-header {
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          color: var(--text);
        }

        .page-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        /* KPI GRID */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-bottom: 32px;
        }

        .kpi-card {
          background: var(--dark-2);
          padding: 28px 24px;
        }

        .kpi-label {
          font-size: 0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
          display: block;
        }

        .kpi-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 300;
          color: var(--gold);
          line-height: 1;
          display: block;
          margin-bottom: 6px;
        }

        .kpi-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        .kpi-value.green { color: var(--green); }
        .kpi-value.pink { color: var(--pink); }
        .kpi-value.sky { color: #7bb8d4; }

        /* GRID 2-COL */
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-bottom: 32px;
        }

        .panel {
          background: var(--dark-2);
          padding: 28px;
        }

        .panel-title {
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* TABLE */
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          font-size: 0.58rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .data-table td {
          font-size: 0.78rem;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(26,26,26,0.5);
          color: var(--text-muted);
          font-weight: 300;
        }

        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: rgba(255,255,255,0.01); }

        /* BADGES */
        .badge {
          font-size: 0.58rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 2px;
          font-weight: 500;
        }

        .badge-trial { background: rgba(123,184,212,0.1); color: #7bb8d4; border: 1px solid rgba(123,184,212,0.2); }
        .badge-basic { background: rgba(184,147,74,0.1); color: var(--gold); border: 1px solid rgba(184,147,74,0.2); }
        .badge-pro { background: rgba(224,122,160,0.1); color: var(--pink); border: 1px solid rgba(224,122,160,0.2); }
        .badge-expired { background: rgba(224,112,112,0.1); color: var(--red); border: 1px solid rgba(224,112,112,0.2); }

        /* BUTTONS */
        .btn-add {
          font-size: 0.62rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--dark);
          background: var(--gold);
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s;
        }

        .btn-add:hover { background: #d4a96a; }

        .btn-delete {
          font-size: 0.6rem;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          transition: color 0.15s;
        }

        .btn-delete:hover { color: var(--red); }

        /* FORM */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 0.6rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .form-field input, .form-field select, .form-field textarea {
          background: var(--dark-3);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 8px 12px;
          font-size: 0.8rem;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.15s;
        }

        .form-field input:focus, .form-field select:focus { border-color: var(--gold); }
        .form-field select option { background: var(--dark-3); }

        .form-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          justify-content: flex-end;
        }

        .btn-cancel {
          font-size: 0.62rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-muted);
          background: none;
          border: 1px solid var(--border);
          padding: 8px 16px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s;
        }

        .btn-cancel:hover { border-color: var(--text-muted); color: var(--text); }

        /* PLAN BREAKDOWN */
        .plan-bar {
          margin-bottom: 16px;
        }

        .plan-bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 0.72rem;
        }

        .plan-bar-track {
          height: 4px;
          background: var(--dark-3);
          border-radius: 2px;
          overflow: hidden;
        }

        .plan-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* HEALTH INDICATORS */
        .health-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
        }

        .dot-green { background: var(--green); }
        .dot-yellow { background: #f0c060; }
        .dot-red { background: var(--red); }

        /* FULL TABLE PANEL */
        .full-panel {
          background: var(--dark-2);
          border: 1px solid var(--border);
          padding: 28px;
          margin-bottom: 32px;
        }

        .full-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .full-panel-title {
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .summary-row {
          display: flex;
          justify-content: flex-end;
          gap: 32px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .summary-item { text-align: right; }
        .summary-label { font-size: 0.6rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); display: block; }
        .summary-value { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--gold); }
      `}</style>

      <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <span className="sidebar-logo">BeautyGlow Admin</span>
          <span className="sidebar-label">Navigation</span>
          {[
            { id: "overview", icon: "◎", label: "Vue d'ensemble" },
            { id: "salons", icon: "◉", label: "Salons" },
            { id: "financial", icon: "◈", label: "Finances" },
            { id: "bookings", icon: "✦", label: "Réservations" },
          ].map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id as any)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="sidebar-bottom">
            <span className="sidebar-badge">Admin Only</span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <div className="page-header">
            <h1 className="page-title">
              {activeTab === "overview" && "Vue d'ensemble"}
              {activeTab === "salons" && "Gestion des Salons"}
              {activeTab === "financial" && "Tableau Financier"}
              {activeTab === "bookings" && "Réservations Récentes"}
            </h1>
            <span className="page-date">
              {new Date().toLocaleDateString("fr-TN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <>
              {/* KPIs */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <span className="kpi-label">MRR</span>
                  <span className="kpi-value">{fmt(mrr)}</span>
                  <span className="kpi-sub">TND / mois</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Salons actifs</span>
                  <span className="kpi-value green">{activeSalons.length}</span>
                  <span className="kpi-sub">
                    {basicSalons.length} Basic · {proSalons.length} Pro
                  </span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Essais actifs</span>
                  <span className="kpi-value sky">{activeTrials.length}</span>
                  <span className="kpi-sub">
                    {expiredTrials.length} expirés
                  </span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Total salons</span>
                  <span className="kpi-value pink">{businesses.length}</span>
                  <span className="kpi-sub">{newThisMonth.length} ce mois</span>
                </div>
              </div>

              <div className="grid-2">
                {/* Plan breakdown */}
                <div className="panel">
                  <div className="panel-title">Répartition des plans</div>
                  {[
                    {
                      label: "Trial",
                      count: trialSalons.length,
                      color: "#7bb8d4",
                    },
                    {
                      label: "Basic (89 TND)",
                      count: basicSalons.length,
                      color: "#b8934a",
                    },
                    {
                      label: "Pro (149 TND)",
                      count: proSalons.length,
                      color: "#e07aa0",
                    },
                  ].map((item) => (
                    <div key={item.label} className="plan-bar">
                      <div className="plan-bar-label">
                        <span style={{ color: "#e8e0d5", fontSize: "0.78rem" }}>
                          {item.label}
                        </span>
                        <span
                          style={{
                            color: item.color,
                            fontFamily: "Cormorant Garamond",
                            fontSize: "1rem",
                          }}
                        >
                          {item.count}
                        </span>
                      </div>
                      <div className="plan-bar-track">
                        <div
                          className="plan-bar-fill"
                          style={{
                            width:
                              businesses.length > 0
                                ? `${(item.count / businesses.length) * 100}%`
                                : "0%",
                            background: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: "24px",
                      paddingTop: "20px",
                      borderTop: "1px solid #1a1a1a",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#666",
                        marginBottom: "8px",
                      }}
                    >
                      ARR Estimé
                    </div>
                    <div
                      style={{
                        fontFamily: "Cormorant Garamond",
                        fontSize: "1.8rem",
                        color: "#b8934a",
                      }}
                    >
                      {fmt(mrr * 12)} TND
                    </div>
                  </div>
                </div>

                {/* Unit economics */}
                <div className="panel">
                  <div className="panel-title">Unit Economics</div>
                  {[
                    {
                      label: "MRR / Salon actif",
                      value:
                        activeSalons.length > 0
                          ? `${(mrr / activeSalons.length).toFixed(0)} TND`
                          : "—",
                    },
                    {
                      label: "Dépenses ce mois",
                      value: `${thisMonthExpenses.toFixed(0)} TND`,
                    },
                    {
                      label: "Profit net",
                      value: `${netProfit.toFixed(0)} TND`,
                      highlight: true,
                    },
                    {
                      label: "Marge brute",
                      value: `${grossMargin}%`,
                      highlight: true,
                    },
                    {
                      label: "Total réservations",
                      value: totalBookings.toString(),
                    },
                    {
                      label: "Taux de conversion",
                      value:
                        businesses.length > 0
                          ? `${((activeSalons.length / businesses.length) * 100).toFixed(0)}%`
                          : "0%",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid #1a1a1a",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "#666" }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: item.highlight ? "#b8934a" : "#e8e0d5",
                          fontFamily: item.highlight
                            ? "Cormorant Garamond"
                            : "Inter",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent signups */}
              <div className="full-panel">
                <div className="full-panel-header">
                  <span className="full-panel-title">
                    Inscriptions récentes
                  </span>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Salon</th>
                      <th>Subdomain</th>
                      <th>Plan</th>
                      <th>Inscrit le</th>
                      <th>Essai expire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.slice(0, 8).map((b) => {
                      const trialExpired =
                        b.plan_type === "trial" &&
                        new Date(b.trial_ends_at) < new Date();
                      return (
                        <tr key={b.id}>
                          <td style={{ color: "#e8e0d5" }}>
                            {b.business_name}
                          </td>
                          <td>{b.subdomain}.beautyglow.tn</td>
                          <td>
                            <span
                              className={`badge badge-${trialExpired ? "expired" : b.plan_type}`}
                            >
                              {trialExpired ? "Expiré" : b.plan_type}
                            </span>
                          </td>
                          <td>
                            {new Date(b.created_at).toLocaleDateString("fr-TN")}
                          </td>
                          <td
                            style={{ color: trialExpired ? "#e07070" : "#666" }}
                          >
                            {b.plan_type === "trial"
                              ? new Date(b.trial_ends_at).toLocaleDateString(
                                  "fr-TN",
                                )
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── SALONS TAB ── */}
          {activeTab === "salons" && (
            <div className="full-panel">
              <div className="full-panel-header">
                <span className="full-panel-title">
                  Tous les salons ({businesses.length})
                </span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Salon</th>
                    <th>Subdomain</th>
                    <th>Plan</th>
                    <th>Statut</th>
                    <th>Inscrit le</th>
                    <th>Essai expire</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b) => {
                    const trialExpired =
                      b.plan_type === "trial" &&
                      new Date(b.trial_ends_at) < new Date();
                    const trialDaysLeft =
                      b.plan_type === "trial"
                        ? Math.ceil(
                            (new Date(b.trial_ends_at).getTime() - Date.now()) /
                              86400000,
                          )
                        : null;
                    return (
                      <tr key={b.id}>
                        <td style={{ color: "#e8e0d5", fontWeight: 400 }}>
                          {b.business_name}
                        </td>
                        <td style={{ fontSize: "0.72rem" }}>
                          {b.subdomain}.beautyglow.tn
                        </td>
                        <td>
                          <span
                            className={`badge badge-${trialExpired ? "expired" : b.plan_type}`}
                          >
                            {trialExpired ? "Expiré" : b.plan_type}
                          </span>
                        </td>
                        <td>
                          {trialExpired ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.72rem",
                                color: "#e07070",
                              }}
                            >
                              <span className="health-dot dot-red" />
                              Expiré
                            </span>
                          ) : b.plan_type === "trial" ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.72rem",
                                color: "#f0c060",
                              }}
                            >
                              <span className="health-dot dot-yellow" />
                              {trialDaysLeft}j restants
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.72rem",
                                color: "#4caf8a",
                              }}
                            >
                              <span className="health-dot dot-green" />
                              Actif
                            </span>
                          )}
                        </td>
                        <td>
                          {new Date(b.created_at).toLocaleDateString("fr-TN")}
                        </td>
                        <td
                          style={{
                            color: trialExpired ? "#e07070" : "#666",
                            fontSize: "0.78rem",
                          }}
                        >
                          {b.plan_type === "trial"
                            ? new Date(b.trial_ends_at).toLocaleDateString(
                                "fr-TN",
                              )
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── FINANCIAL TAB ── */}
          {activeTab === "financial" && (
            <>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <span className="kpi-label">MRR</span>
                  <span className="kpi-value">{fmt(mrr)}</span>
                  <span className="kpi-sub">TND / mois</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Dépenses (mois)</span>
                  <span className="kpi-value" style={{ color: "#e07070" }}>
                    {thisMonthExpenses.toFixed(0)}
                  </span>
                  <span className="kpi-sub">TND ce mois</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Profit net</span>
                  <span className="kpi-value green">
                    {netProfit.toFixed(0)}
                  </span>
                  <span className="kpi-sub">TND ce mois</span>
                </div>
                <div className="kpi-card">
                  <span className="kpi-label">Marge brute</span>
                  <span className="kpi-value pink">{grossMargin}%</span>
                  <span className="kpi-sub">Objectif: &gt;70%</span>
                </div>
              </div>

              <div className="full-panel">
                <div className="full-panel-header">
                  <span className="full-panel-title">Dépenses</span>
                  <button
                    className="btn-add"
                    onClick={() => setShowExpenseForm(!showExpenseForm)}
                  >
                    + Ajouter
                  </button>
                </div>

                {showExpenseForm && (
                  <div
                    style={{
                      background: "#0d0d0d",
                      border: "1px solid #1a1a1a",
                      padding: "20px",
                      marginBottom: "20px",
                      borderRadius: "2px",
                    }}
                  >
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Date</label>
                        <input
                          type="date"
                          value={expenseForm.date}
                          onChange={(e) =>
                            setExpenseForm({
                              ...expenseForm,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Catégorie</label>
                        <select
                          value={expenseForm.category}
                          onChange={(e) =>
                            setExpenseForm({
                              ...expenseForm,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="infrastructure">Infrastructure</option>
                          <option value="sales">Sales</option>
                          <option value="marketing">Marketing</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                      <div
                        className="form-field"
                        style={{ gridColumn: "1 / -1" }}
                      >
                        <label>Description</label>
                        <input
                          type="text"
                          placeholder="ex: Supabase Pro"
                          value={expenseForm.description}
                          onChange={(e) =>
                            setExpenseForm({
                              ...expenseForm,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Montant (TND)</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={expenseForm.amount}
                          onChange={(e) =>
                            setExpenseForm({
                              ...expenseForm,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Notes (optionnel)</label>
                        <input
                          type="text"
                          placeholder="..."
                          value={expenseForm.notes}
                          onChange={(e) =>
                            setExpenseForm({
                              ...expenseForm,
                              notes: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => setShowExpenseForm(false)}
                      >
                        Annuler
                      </button>
                      <button className="btn-add" onClick={handleAddExpense}>
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Catégorie</th>
                      <th>Description</th>
                      <th>Montant</th>
                      <th>Notes</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {localExpenses.map((e) => (
                      <tr key={e.id}>
                        <td>{new Date(e.date).toLocaleDateString("fr-TN")}</td>
                        <td>
                          <span
                            className="badge badge-trial"
                            style={{ textTransform: "capitalize" }}
                          >
                            {e.category}
                          </span>
                        </td>
                        <td style={{ color: "#e8e0d5" }}>{e.description}</td>
                        <td
                          style={{
                            color: "#e07070",
                            fontFamily: "Cormorant Garamond",
                            fontSize: "1rem",
                          }}
                        >
                          {Number(e.amount).toFixed(2)} TND
                        </td>
                        <td>{e.notes || "—"}</td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteExpense(e.id)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="summary-row">
                  <div className="summary-item">
                    <span className="summary-label">Total dépenses</span>
                    <span className="summary-value">
                      {totalExpenses.toFixed(2)} TND
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">MRR - Dépenses</span>
                    <span
                      className="summary-value"
                      style={{ color: "#4caf8a" }}
                    >
                      {(mrr - thisMonthExpenses).toFixed(2)} TND
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── BOOKINGS TAB ── */}
          {activeTab === "bookings" && (
            <div className="full-panel">
              <div className="full-panel-header">
                <span className="full-panel-title">
                  Réservations récentes ({totalBookings} total)
                </span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Salon</th>
                    <th>Client</th>
                    <th>Téléphone</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b: any) => (
                    <tr key={b.id}>
                      <td style={{ color: "#e8e0d5" }}>
                        {b.businesses?.business_name || "—"}
                      </td>
                      <td>{b.customer_name}</td>
                      <td>{b.customer_phone}</td>
                      <td>
                        {new Date(b.booking_date).toLocaleDateString("fr-TN")}
                      </td>
                      <td>{b.booking_time}</td>
                      <td>
                        <span
                          className={`badge ${
                            b.status === "confirmed"
                              ? "badge-basic"
                              : b.status === "completed"
                                ? "badge-pro"
                                : b.status === "cancelled"
                                  ? "badge-expired"
                                  : "badge-trial"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
