// src/app/dashboard/page.tsx
// Dashboard overview — stats + today's bookings + quick actions

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  // Get today's bookings
  const today = new Date().toISOString().split('T')[0]
  const { data: todayBookings } = await supabase
    .from('bookings')
    .select('*, services(name, price)')
    .eq('business_id', business.id)
    .eq('booking_date', today)
    .order('booking_time', { ascending: true })

  // Get this month's stats
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0]

  const { data: monthBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('business_id', business.id)
    .gte('booking_date', monthStart)

  // Get total customers
  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)

  // Get pending bookings
  const { data: pendingBookings } = await supabase
    .from('bookings')
    .select('*, services(name, price)')
    .eq('business_id', business.id)
    .eq('status', 'pending')
    .order('booking_date', { ascending: true })
    .limit(5)

  const monthRevenue = monthBookings?.reduce((sum, b) => {
    return b.status !== 'cancelled' ? sum + (b.services?.price || 0) : sum
  }, 0) || 0

  const statusColors: Record<string, string> = {
    pending:   '#c9a96e',
    confirmed: '#4ade80',
    cancelled: '#ef4444',
    completed: '#888',
    no_show:   '#ef4444',
  }

  const statusLabels: Record<string, string> = {
    pending:   'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé',
    no_show:   'Absent',
  }

  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #0d0d0d;
          padding: 28px 24px;
        }

        .stat-card-label {
          font-size: 0.62rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 12px;
          display: block;
        }

        .stat-card-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 400;
          color: #c9a96e;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-card-sub {
          font-size: 0.72rem;
          color: #333;
          font-weight: 300;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title a {
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
          text-decoration: none;
          transition: color 0.2s;
        }

        .section-title a:hover { color: #c9a96e; }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }

        .bookings-table th {
          text-align: left;
          font-size: 0.6rem;
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
          font-size: 0.85rem;
          color: #888;
          font-weight: 300;
        }

        .bookings-table tr:hover td {
          background: rgba(255,255,255,0.01);
        }

        .booking-name {
          color: #e8e0d5;
          font-weight: 400;
        }

        .booking-service {
          color: #666;
          font-size: 0.78rem;
        }

        .status-badge {
          font-size: 0.62rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          border: 1px solid #1a1a1a;
          color: #333;
        }

        .empty-state-icon {
          font-size: 2rem;
          margin-bottom: 12px;
          display: block;
          opacity: 0.3;
        }

        .empty-state-text {
          font-size: 0.85rem;
          color: #333;
          font-weight: 300;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          margin-bottom: 40px;
        }

        .quick-action {
          background: #0d0d0d;
          padding: 24px;
          text-decoration: none;
          color: #555;
          font-size: 0.78rem;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quick-action:hover {
          background: #111;
          color: #c9a96e;
        }

        .quick-action-icon {
          font-size: 1rem;
          opacity: 0.5;
        }

        .trial-banner {
          background: rgba(201,169,110,0.06);
          border: 1px solid rgba(201,169,110,0.15);
          padding: 16px 24px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .trial-banner-text {
          font-size: 0.82rem;
          color: #c9a96e;
          font-weight: 300;
        }

        .trial-banner-btn {
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #0d0d0d;
          background: #c9a96e;
          text-decoration: none;
          padding: 8px 20px;
          transition: background 0.2s;
        }

        .trial-banner-btn:hover { background: #e8c98a; }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .bookings-table { font-size: 0.78rem; }
          .bookings-table td, .bookings-table th { padding: 12px 8px; }
        }
      `}</style>

      {/* Trial Banner */}
      {business.plan_type === 'trial' && (
        <div className="trial-banner">
          <span className="trial-banner-text">
            ⏳ Votre période d&apos;essai se termine le{' '}
            {new Date(business.trial_ends_at).toLocaleDateString('fr-TN')}
          </span>
          <a href="/dashboard/settings" className="trial-banner-btn">
            Mettre à niveau →
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-label">Réservations aujourd&apos;hui</span>
          <div className="stat-card-value">{todayBookings?.length || 0}</div>
          <div className="stat-card-sub">
            {todayBookings?.filter(b => b.status === 'pending').length || 0} en attente
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Ce mois</span>
          <div className="stat-card-value">{monthBookings?.length || 0}</div>
          <div className="stat-card-sub">réservations totales</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Revenus estimés</span>
          <div className="stat-card-value">{monthRevenue}</div>
          <div className="stat-card-sub">TND ce mois</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Clients total</span>
          <div className="stat-card-value">{totalCustomers || 0}</div>
          <div className="stat-card-sub">dans votre base</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-title">
        Actions rapides
      </div>
      <div className="quick-actions">
        <Link href="/dashboard/services" className="quick-action">
          <span className="quick-action-icon">✦</span>
          Ajouter un service
        </Link>
        <Link href="/dashboard/photos" className="quick-action">
          <span className="quick-action-icon">◻</span>
          Ajouter des photos
        </Link>
        <Link href="/dashboard/bookings" className="quick-action">
          <span className="quick-action-icon">◎</span>
          Voir les réservations
        </Link>
        <Link href="/dashboard/settings" className="quick-action">
          <span className="quick-action-icon">◉</span>
          Modifier mon profil
        </Link>
      </div>

      <div className="two-col">
        {/* Today's Bookings */}
        <div>
          <div className="section-title">
            Réservations aujourd&apos;hui
            <Link href="/dashboard/bookings">Tout voir →</Link>
          </div>
          {todayBookings && todayBookings.length > 0 ? (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Heure</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {todayBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-name">{booking.customer_name}</div>
                      <div className="booking-service">
                        {booking.services?.name || '—'}
                      </div>
                    </td>
                    <td>{booking.booking_time}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          color: statusColors[booking.status],
                          background: `${statusColors[booking.status]}15`,
                        }}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">◎</span>
              <p className="empty-state-text">Aucune réservation aujourd&apos;hui</p>
            </div>
          )}
        </div>

        {/* Pending Bookings */}
        <div>
          <div className="section-title">
            En attente de confirmation
            <Link href="/dashboard/bookings">Tout voir →</Link>
          </div>
          {pendingBookings && pendingBookings.length > 0 ? (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Heure</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-name">{booking.customer_name}</div>
                      <div className="booking-service">
                        {booking.services?.name || '—'}
                      </div>
                    </td>
                    <td>
                      {new Date(booking.booking_date)
                        .toLocaleDateString('fr-TN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                    </td>
                    <td>{booking.booking_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">✦</span>
              <p className="empty-state-text">Aucune réservation en attente</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}