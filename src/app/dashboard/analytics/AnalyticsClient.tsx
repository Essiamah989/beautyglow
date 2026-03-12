"use client"

import { useMemo } from "react"

interface Booking {
  id: string
  booking_date: string
  status: string
  service_id: string | null
}

interface Customer {
  id: string
  created_at: string
}

interface Service {
  id: string
  name: string
  price: number
}

interface Props {
  bookings: Booking[]
  customers: Customer[]
  services: Service[]
}

export default function AnalyticsClient({ bookings, customers, services }: Props) {
  const stats = useMemo(() => {
    // Current Date details
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Revenue calculations
    let totalRevenue = 0
    let currentMonthRevenue = 0
    let lastMonthRevenue = 0

    const validBookings = bookings.filter(b => b.status === "completed" || b.status === "confirmed")

    validBookings.forEach(booking => {
      const service = services.find(s => s.id === booking.service_id)
      if (service) {
        totalRevenue += service.price
        
        const bDate = new Date(booking.booking_date)
        if (bDate.getFullYear() === currentYear && bDate.getMonth() === currentMonth) {
          currentMonthRevenue += service.price
        } else if (
          bDate.getFullYear() === currentYear && bDate.getMonth() === currentMonth - 1 ||
          (currentMonth === 0 && bDate.getFullYear() === currentYear - 1 && bDate.getMonth() === 11)
        ) {
          lastMonthRevenue += service.price
        }
      }
    })

    // Customer calculations
    let currentMonthCustomers = 0
    let lastMonthCustomers = 0

    customers.forEach(customer => {
      const cDate = new Date(customer.created_at)
      if (cDate.getFullYear() === currentYear && cDate.getMonth() === currentMonth) {
        currentMonthCustomers++
      } else if (
        cDate.getFullYear() === currentYear && cDate.getMonth() === currentMonth - 1 ||
        (currentMonth === 0 && cDate.getFullYear() === currentYear - 1 && cDate.getMonth() === 11)
      ) {
        lastMonthCustomers++
      }
    })

    // Top Services
    const serviceCounts: Record<string, number> = {}
    validBookings.forEach(b => {
      if (b.service_id) {
        serviceCounts[b.service_id] = (serviceCounts[b.service_id] || 0) + 1
      }
    })

    const topServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([serviceId, count]) => {
        const s = services.find(x => x.id === serviceId)
        return { name: s?.name || "Service Inconnu", count, revenue: count * (s?.price || 0) }
      })

    // Prepare chart data (Last 6 months revenue)
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"]
    const chartData = []
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1)
      const m = d.getMonth()
      const y = d.getFullYear()
      
      let mRev = 0
      validBookings.forEach(booking => {
        const bDate = new Date(booking.booking_date)
        if (bDate.getFullYear() === y && bDate.getMonth() === m) {
          const service = services.find(s => s.id === booking.service_id)
          if (service) mRev += service.price
        }
      })
      
      chartData.push({ label: months[m], revenue: mRev })
    }

    const maxChartValue = Math.max(...chartData.map(d => d.revenue), 100)

    const revenueGrowth = lastMonthRevenue ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 100
    const customerGrowth = lastMonthCustomers ? ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 100

    return {
      totalRevenue,
      currentMonthRevenue,
      revenueGrowth,
      totalCustomers: customers.length,
      currentMonthCustomers,
      customerGrowth,
      totalBookings: validBookings.length,
      topServices,
      chartData,
      maxChartValue
    }
  }, [bookings, customers, services])

  return (
    <div className="fade-in">
      <div className="section-header" style={{ marginBottom: "32px" }}>
        <h2 className="section-title" style={{ marginBottom: "8px" }}>Analytique</h2>
        <p className="section-desc">Suivez les performances de votre salon (réservations, revenus, clients).</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        {/* Revenue Card */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ color: "var(--text-light)", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>Revenu ce mois</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)" }}>{stats.currentMonthRevenue.toFixed(2)} TND</div>
          <div style={{ fontSize: "0.85rem", color: stats.revenueGrowth >= 0 ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: "4px" }}>
            {stats.revenueGrowth >= 0 ? "↑" : "↓"} {Math.abs(stats.revenueGrowth).toFixed(1)}% vs mois dernier
          </div>
        </div>

        {/* Bookings Card */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ color: "var(--text-light)", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>Total Réservations</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)" }}>{stats.totalBookings}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>Validées ou terminées</div>
        </div>

        {/* Customers Card */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ color: "var(--text-light)", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>Nouveaux clients (Mois)</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-dark)" }}>{stats.currentMonthCustomers}</div>
          <div style={{ fontSize: "0.85rem", color: stats.customerGrowth >= 0 ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: "4px" }}>
            {stats.customerGrowth >= 0 ? "↑" : "↓"} {Math.abs(stats.customerGrowth).toFixed(1)}% vs mois dernier
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Simple Revenue Chart */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "1.1rem" }}>Revenu (6 derniers mois)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "250px", marginTop: "auto", paddingTop: "20px" }}>
            {stats.chartData.map((data, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%", justifyContent: "center" }}>
                  <div 
                    style={{ 
                      width: "100%", 
                      maxWidth: "40px", 
                      backgroundColor: "var(--primary)", 
                      height: `${(data.revenue / stats.maxChartValue) * 100}%`,
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.5s ease"
                    }} 
                  />
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{data.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "1.1rem" }}>Top Services</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {stats.topServices.length > 0 ? stats.topServices.map((service, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{service.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>{service.count} réservation{service.count !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ fontWeight: 600, color: "var(--primary)" }}>
                  {service.revenue.toFixed(2)} TND
                </div>
              </div>
            )) : (
              <div style={{ fontSize: "0.85rem", color: "var(--text-light)", textAlign: "center", padding: "20px 0" }}>
                Aucune donnée de réservation pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
