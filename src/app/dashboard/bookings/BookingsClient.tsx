'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Booking {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  booking_date: string
  booking_time: string
  status: string
  notes: string
  services: { name: string; price: number } | null
}

interface Props {
  bookings: Booking[]
  businessId: string
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  completed: 'Terminé',
  no_show:   'Absent',
}

const STATUS_BADGE: Record<string, string> = {
  pending:   'badge badge-pending',
  confirmed: 'badge badge-confirmed',
  cancelled: 'badge badge-cancelled',
  completed: 'badge badge-completed',
  no_show:   'badge badge-no_show',
}

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function BookingsClient({ bookings: initial }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initial)
  const [filter, setFilter]     = useState<string>('all')
  const [loading, setLoading]   = useState<string | null>(null)
  const [search, setSearch]     = useState('')

  const updateStatus = async (id: string, status: string) => {
    setLoading(id)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setLoading(null)
    }
  }

  const counts: Record<string, number> = {
    all:       bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filtered = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter
    const matchesSearch = search === '' ||
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_phone.includes(search)
    return matchesFilter && matchesSearch
  })

  return (
    <div>

      {/* ── Filter tabs ── */}
      <div className="filter-tabs">
        {FILTERS.map(key => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key === 'all' ? 'Toutes' : STATUS_LABELS[key]}
            <span className="filter-count">{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="search-wrap">
        <span className="search-icon"><IconSearch /></span>
        <input
          className="search-input"
          placeholder="Rechercher par nom ou téléphone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Results count ── */}
      <p className="results-count">
        {filtered.length} réservation{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* ── Bookings card ── */}
      {filtered.length > 0 ? (
        <div className="dash-card">

          {/* Table header */}
          <div className="booking-row booking-row-header">
            <span className="booking-col-label">Client</span>
            <span className="booking-col-label">Service</span>
            <span className="booking-col-label">Date</span>
            <span className="booking-col-label">Statut</span>
            <span className="booking-col-label">Actions</span>
          </div>

          {filtered.map(booking => (
            <div key={booking.id} className="booking-row">

              {/* Customer */}
              <div>
                <div className="booking-customer">{booking.customer_name}</div>
                <div className="booking-phone">{booking.customer_phone}</div>
              </div>

              {/* Service */}
              <div>
                <div className="booking-service">
                  {booking.services?.name || '—'}
                </div>
                {booking.services?.price && (
                  <div className="booking-price">{booking.services.price} TND</div>
                )}
              </div>

              {/* Date & time */}
              <div>
                <div className="booking-date">
                  {new Date(booking.booking_date).toLocaleDateString('fr-TN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </div>
                <div className="booking-time">{booking.booking_time}</div>
              </div>

              {/* Status badge */}
              <div className="booking-status-cell">
                <span className={STATUS_BADGE[booking.status] ?? 'badge'}>
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>

              {/* Actions */}
              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <>
                    <button
                      className="btn-confirm"
                      disabled={loading === booking.id}
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                    >
                      {loading === booking.id ? '...' : 'Confirmer'}
                    </button>
                    <button
                      className="btn-cancel"
                      disabled={loading === booking.id}
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                    >
                      Annuler
                    </button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <>
                    <button
                      className="btn-action"
                      disabled={loading === booking.id}
                      onClick={() => updateStatus(booking.id, 'completed')}
                    >
                      {loading === booking.id ? '...' : 'Terminé'}
                    </button>
                    <button
                      className="btn-cancel"
                      disabled={loading === booking.id}
                      onClick={() => updateStatus(booking.id, 'no_show')}
                    >
                      Absent
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">◎</div>
          <p className="empty-state-text">Aucune réservation trouvée</p>
        </div>
      )}
    </div>
  )
}