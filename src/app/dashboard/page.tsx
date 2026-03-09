// src/app/dashboard/page.tsx
// Dashboard overview — stats + today's bookings + quick actions

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import '@/styles/dashboard.css'

const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  completed: 'Terminé',
  no_show:   'Absent',
}

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

  // Today's bookings
  const today = new Date().toISOString().split('T')[0]
  const { data: todayBookings } = await supabase
    .from('bookings')
    .select('*, services(name, price)')
    .eq('business_id', business.id)
    .eq('booking_date', today)
    .order('booking_time', { ascending: true })

  // This month's bookings
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0]

  const { data: monthBookings } = await supabase
    .from('bookings')
    .select('*, services(price)')
    .eq('business_id', business.id)
    .gte('booking_date', monthStart)

  // Total customers
  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)

  // Pending bookings (up to 5)
  const { data: pendingBookings } = await supabase
    .from('bookings')
    .select('*, services(name, price)')
    .eq('business_id', business.id)
    .eq('status', 'pending')
    .order('booking_date', { ascending: true })
    .limit(5)

  // Revenue = only completed bookings (money actually received)
  const monthRevenue = monthBookings?.reduce((sum, b) =>
    b.status === 'completed' ? sum + (b.services?.price ?? 0) : sum
  , 0) ?? 0

  return (
    <>
      {/* ── Trial Banner ── */}
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

      {/* ── Stats ── */}
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
          <div className="stat-card-value">
            {monthRevenue}<span> TND</span>
          </div>
          <div className="stat-card-sub">
            {monthBookings?.filter(b => b.status === 'completed').length || 0} terminées ce mois
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Clients total</span>
          <div className="stat-card-value">{totalCustomers || 0}</div>
          <div className="stat-card-sub">dans votre base</div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="section-title">Actions rapides</div>
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

      {/* ── Two-column tables ── */}
      <div className="two-col">

        {/* Today's bookings */}
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
                {todayBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-name">{booking.customer_name}</div>
                      <div className="booking-service">
                        {booking.services?.name || '—'}
                      </div>
                    </td>
                    <td>{booking.booking_time}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◎</div>
              <p className="empty-state-text">Aucune réservation aujourd&apos;hui</p>
            </div>
          )}
        </div>

        {/* Pending bookings */}
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
                {pendingBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <div className="booking-name">{booking.customer_name}</div>
                      <div className="booking-service">
                        {booking.services?.name || '—'}
                      </div>
                    </td>
                    <td>
                      {new Date(booking.booking_date).toLocaleDateString('fr-TN', {
                        day: 'numeric', month: 'short'
                      })}
                    </td>
                    <td>{booking.booking_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✦</div>
              <p className="empty-state-text">Aucune réservation en attente</p>
            </div>
          )}
        </div>

      </div>
    </>
  )
}