"use client"

import { useMemo } from "react"

/**
 * Analytics Dashboard component - REBUILT FROM SCRATCH
 * Designed for maximum reliability on all browsers.
 */
export default function AnalyticsClient({ bookings = [], customers = [], services = [] }: any) {
  
  const stats = useMemo(() => {
    // 1. Setup Dates
    const now = new Date()
    const currentMonthIndex = now.getMonth() // 0-11
    const currentYear = now.getFullYear()

    // 2. Map services for fast price lookup
    const servicePriceMap: Record<string, number> = {}
    services.forEach((s: any) => {
      servicePriceMap[s.id] = parseFloat(String(s.price)) || 0
    })

    // 3. Filter valid bookings (Confirmed or Completed)
    const validBookings = bookings.filter((b: any) => 
      b.status?.toLowerCase() === "completed" || b.status?.toLowerCase() === "confirmed"
    )

    // 4. Helper to calculate revenue for a specific Year/Month
    const calculateMonthRevenue = (year: number, month: number) => {
      return validBookings.reduce((acc: number, b: any) => {
        if (!b.booking_date) return acc
        
        // Expected format "YYYY-MM-DD"
        const parts = b.booking_date.split("-")
        const bYear = parseInt(parts[0])
        const bMonth = parseInt(parts[1]) // 1-indexed

        if (bYear === year && bMonth === (month + 1)) {
          return acc + (servicePriceMap[b.service_id] || 0)
        }
        return acc
      }, 0)
    }

    // 5. Build Chart Data (Last 6 Months)
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
    const chartData = []
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonthIndex - i, 1)
      const targetYear = d.getFullYear()
      const targetMonth = d.getMonth()
      
      const revenue = calculateMonthRevenue(targetYear, targetMonth)
      
      chartData.push({
        label: monthNames[targetMonth],
        revenue: revenue,
        monthKey: `${targetYear}-${targetMonth}`
      })
    }

    // 6. Summary Stats
    const currentMonthRevenue = calculateMonthRevenue(currentYear, currentMonthIndex)
    
    const lastMonthDate = new Date(currentYear, currentMonthIndex - 1, 1)
    const lastMonthRevenue = calculateMonthRevenue(lastMonthDate.getFullYear(), lastMonthDate.getMonth())
    
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : (currentMonthRevenue > 0 ? 100 : 0)

    const maxGraphRevenue = Math.max(...chartData.map(d => d.revenue), 100)

    // 7. Top Services Calculation
    const serviceRevenue: Record<string, { name: string, rev: number, count: number }> = {}
    validBookings.forEach(b => {
      const sId = b.service_id
      if (!sId) return
      
      if (!serviceRevenue[sId]) {
        const s = services.find((x: any) => x.id === sId)
        serviceRevenue[sId] = { name: s?.name || "Service Inconnu", rev: 0, count: 0 }
      }
      
      const price = servicePriceMap[sId] || 0
      serviceRevenue[sId].rev += price
      serviceRevenue[sId].count += 1
    })

    const topServices = Object.values(serviceRevenue)
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 5)

    return {
      currentMonthRevenue,
      revenueGrowth,
      totalBookings: validBookings.length,
      chartData,
      maxGraphRevenue,
      topServices,
      hasData: validBookings.length > 0
    }
  }, [bookings, services])

  return (
    <div className="fade-in">
      <div style={{ marginBottom: "40px" }}>
        <h2 className="section-title" style={{ fontSize: "1.75rem", marginBottom: "8px" }}>Statistiques & Analytique</h2>
        <p className="section-desc">Retrouvez ici la performance globale de votre établissement.</p>
      </div>

      {/* Overview Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "24px", 
        marginBottom: "40px" 
      }}>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--pink)" }}>
          <span className="stat-card-label">Revenu ce mois</span>
          <div className="stat-card-value">{stats.currentMonthRevenue.toFixed(2)} <span>TND</span></div>
          <div style={{ fontSize: "0.85rem", color: stats.revenueGrowth >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
             {stats.revenueGrowth >= 0 ? "↑ +" : "↓ "}{Math.abs(stats.revenueGrowth).toFixed(1)}% <span style={{ color: "var(--text-light)", fontWeight: 400 }}>vs mois dernier</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">Réservations</span>
          <div className="stat-card-value">{stats.totalBookings}</div>
          <div className="stat-card-sub">Réservations confirmées ou terminées</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 2fr))", gap: "32px" }}>
        
        {/* Main Chart Section */}
        <div className="dash-card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="dash-card-header">
            <h3 className="dash-card-title">Évolution du Revenu (6 mois)</h3>
          </div>
          <div className="dash-card-body" style={{ flex: 1, padding: "40px 30px" }}>
            
            <div style={{ 
              height: "250px", 
              borderBottom: "1px solid var(--border-solid)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "10px",
              paddingBottom: "1px",
              marginBottom: "20px",
              position: "relative"
            }}>
              {/* Vertical Guide Lines */}
              {[0, 25, 50, 75, 100].map(p => (
                <div key={p} style={{ 
                  position: "absolute", 
                  bottom: `${p}%`, 
                  left: 0, right: 0, 
                  height: "1px", 
                  background: "var(--border-solid)", 
                  opacity: 0.4, 
                  zIndex: 0 
                }} />
              ))}

              {stats.chartData.map((data, idx) => {
                const heightPercent = (data.revenue / stats.maxGraphRevenue) * 100
                const barHeight = Math.max(heightPercent, data.revenue > 0 ? 3 : 0)
                
                return (
                  <div key={idx} style={{ 
                    flex: 1, 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    zIndex: 1
                  }}>
                    {/* Value Label on Top */}
                    {data.revenue > 0 && (
                      <div style={{ 
                        fontSize: "0.7rem", 
                        fontWeight: 700, 
                        color: "var(--pink-deep)",
                        marginBottom: "6px"
                      }}>
                        {Math.round(data.revenue)}
                      </div>
                    )}

                    {/* The Bar itself */}
                    <div style={{ 
                      width: "80%", 
                      maxWidth: "40px", 
                      height: `${barHeight}%`, 
                      background: "linear-gradient(to top, var(--pink), #FF69B4)", 
                      borderRadius: "6px 6px 0 0",
                      transition: "height 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
                      boxShadow: data.revenue > 0 ? "0 -2px 10px var(--pink-glow-sm)" : "none",
                      minHeight: data.revenue > 0 ? "4px" : "0px"
                    }} />
                    
                    {/* Month Label */}
                    <div style={{ 
                      position: "absolute",
                      bottom: "-25px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-light)"
                    }}>
                      {data.label}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {!stats.hasData && (
              <div style={{ textAlign: "center", color: "var(--text-light)", marginTop: "40px", fontStyle: "italic" }}>
                Aucune donnée de réservation trouvée pour cette période.
              </div>
            )}
          </div>
        </div>

        {/* Top Services Table */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Services les plus Demandés</h3>
          </div>
          <div className="dash-card-body">
            {stats.topServices.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {stats.topServices.map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid var(--cream-dark)" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{s.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{s.count} réservations</div>
                    </div>
                    <div style={{ fontWeight: 700, color: "var(--pink-deep)", fontSize: "1.1rem" }}>
                      {s.rev.toFixed(2)} <span style={{ fontSize: "0.7rem" }}>TND</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "var(--text-light)", padding: "20px" }}>Aucun service enregistré.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
