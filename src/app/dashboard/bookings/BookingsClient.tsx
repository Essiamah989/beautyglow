// src/app/dashboard/bookings/BookingsClient.tsx
// Client component — filter, confirm, cancel bookings

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

export default function BookingsClient({ bookings: initial, businessId }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initial)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const updateStatus = async (id: string, status: string) => {
    setLoading(id)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status } : b)
      )
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setLoading(null)
    }
  }

  const filtered = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter
    const matchesSearch = search === '' ||
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_phone.includes(search)
    return matchesFilter && matchesSearch
  })

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <>
      <style>{`
        .filters {
          display: flex;
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-btn {
          flex: 1;
          min-width: 100px;
          padding: 14px 16px;
          background: #0d0d0d;
          border: none;
          color: #444;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .filter-btn:hover { background: #111; color: #888; }

        .filter-btn.active {
          background: #111;
          color: #c9a96e;
        }

        .filter-count {
          display: inline-block;
          background: #1a1a1a;
          color: #555;
          font-size: 0.65rem;
          padding: 2px 7px;
          border-radius: 10px;
          margin-left: 6px;
        }

        .filter-btn.active .filter-count {
          background: rgba(201,169,110,0.15);
          color: #c9a96e;
        }

        .search-bar {
          margin-bottom: 24px;
        }

        .search-input {
          width: 100%;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          color: #e8e0d5;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          padding: 14px 20px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus { border-color: #c9a96e; }
        .search-input::placeholder { color: #333; }

        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .booking-row {
          background: #0d0d0d;
          padding: 20px 24px;
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          transition: background 0.15s;
        }

        .booking-row:hover { background: #111; }

        .booking-customer {
          font-size: 0.92rem;
          color: #e8e0d5;
          font-weight: 400;
          margin-bottom: 4px;
        }

        .booking-phone {
          font-size: 0.75rem;
          color: #444;
          font-weight: 300;
        }

        .booking-service {
          font-size: 0.85rem;
          color: #666;
          font-weight: 300;
          margin-bottom: 4px;
        }

        .booking-price {
          font-size: 0.75rem;
          color: #c9a96e;
          opacity: 0.7;
        }

        .booking-datetime {
          font-size: 0.85rem;
          color: #666;
          font-weight: 300;
        }

        .booking-time {
          font-size: 0.78rem;
          color: #444;
          margin-top: 2px;
        }

        .status-badge {
          font-size: 0.62rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 5px 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .booking-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .action-btn {
          font-size: 0.62rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 7px 14px;
          border: 1px solid #1e1e1e;
          background: none;
          color: #555;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .action-btn:hover { border-color: #c9a96e; color: #c9a96e; }
        .action-btn.confirm:hover { border-color: #4ade80; color: #4ade80; }
        .action-btn.cancel:hover { border-color: #ef4444; color: #ef4444; }
        .action-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          border: 1px solid #1a1a1a;
          color: #333;
        }

        .results-count {
          font-size: 0.72rem;
          color: #333;
          letter-spacing: 1px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .booking-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .booking-actions {
            justify-content: flex-start;
          }
        }
      `}</style>

      {/* Filters */}
      <div className="filters">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key === 'all' ? 'Tous' : statusLabels[key]}
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Rechercher par nom ou téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results count */}
      <div className="results-count">
        {filtered.length} réservation{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="bookings-list">
          {filtered.map((booking) => (
            <div key={booking.id} className="booking-row">

              {/* Customer */}
              <div>
                <div className="booking-customer">{booking.customer_name}</div>
                <div className="booking-phone">📞 {booking.customer_phone}</div>
              </div>

              {/* Service */}
              <div>
                <div className="booking-service">
                  {booking.services?.name || 'Service non spécifié'}
                </div>
                {booking.services?.price && (
                  <div className="booking-price">{booking.services.price} TND</div>
                )}
              </div>

              {/* Date */}
              <div>
                <div className="booking-datetime">
                  {new Date(booking.booking_date).toLocaleDateString('fr-TN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="booking-time">⏱ {booking.booking_time}</div>
              </div>

              {/* Status */}
              <div>
                <span
                  className="status-badge"
                  style={{
                    color: statusColors[booking.status],
                    background: `${statusColors[booking.status]}15`,
                  }}
                >
                  {statusLabels[booking.status]}
                </span>
              </div>

              {/* Actions */}
              <div className="booking-actions">
                {booking.status === 'pending' && (
                  <>
                    <button
                      className="action-btn confirm"
                      disabled={loading === booking.id}
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                    >
                      {loading === booking.id ? '...' : 'Confirmer'}
                    </button>
                    <button
                      className="action-btn cancel"
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
                      className="action-btn"
                      disabled={loading === booking.id}
                      onClick={() => updateStatus(booking.id, 'completed')}
                    >
                      {loading === booking.id ? '...' : 'Terminé'}
                    </button>
                    <button
                      className="action-btn cancel"
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
          <p style={{ fontSize: '2rem', marginBottom: '12px', opacity: 0.2 }}>◎</p>
          <p style={{ fontSize: '0.85rem', color: '#333', fontWeight: 300 }}>
            Aucune réservation trouvée
          </p>
        </div>
      )}
    </>
  )
}