// src/app/dashboard/services/ServicesClient.tsx
'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_minutes: number
  category: string
  is_active: boolean
  display_order: number
}

interface Props {
  services: Service[]
  businessId: string
  planType: string
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CATEGORIES = [
  'haircut', 'coloring', 'treatment', 'styling',
  'nails', 'makeup', 'facial', 'massage', 'other',
]

const emptyForm = {
  name: '',
  description: '',
  price: '',
  duration_minutes: '',
  category: 'haircut',
}

export default function ServicesClient({ services: initial, businessId, planType }: Props) {
  const [services, setServices]   = useState<Service[]>(initial)
  const [showForm, setShowForm]   = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm]           = useState(emptyForm)
  const [loading, setLoading]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const serviceLimit = planType === 'basic' || planType === 'trial' ? 10 : planType === 'pro' ? 30 : Infinity
  const canAddMore = services.length < serviceLimit

  const openAdd = () => {
    if (!canAddMore) {
      alert(`Limite atteinte (${serviceLimit} services pour votre plan). Mettez à niveau pour en ajouter d'autres.`)
      return
    }
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (service: Service) => {
    setForm({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString(),
      category: service.category || 'haircut',
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration_minutes) return
    setLoading(true)
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('services')
          .update({
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            duration_minutes: parseInt(form.duration_minutes),
            category: form.category,
          })
          .eq('id', editingId)
          .select()
          .single()

        if (error) throw error
        setServices(prev => prev.map(s => s.id === editingId ? data : s))
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert({
            business_id: businessId,
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            duration_minutes: parseInt(form.duration_minutes),
            category: form.category,
            display_order: services.length,
            is_active: true,
          })
          .select()
          .single()

        if (error) throw error
        setServices(prev => [...prev, data])
      }
      closeForm()
    } catch (err: any) {
      console.error('Save failed:', err?.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce service?')) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
      setServices(prev => prev.filter(s => s.id !== id))
    } catch (err: any) {
      console.error('Delete failed:', err?.message)
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id)
      if (error) throw error
      setServices(prev =>
        prev.map(s => s.id === service.id ? { ...s, is_active: !s.is_active } : s)
      )
    } catch (err: any) {
      console.error('Toggle failed:', err?.message)
    }
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header">
        <p className="page-header-title">
          {services.length} service{services.length !== 1 ? 's' : ''} au total
        </p>
        <button className="add-btn" onClick={openAdd} disabled={!canAddMore} title={!canAddMore ? 'Limite de services atteinte' : ''} style={{ opacity: canAddMore ? 1 : 0.5, cursor: canAddMore ? 'pointer' : 'not-allowed' }}>
          + Ajouter un service
        </button>
      </div>

      {/* ── Services list ── */}
      {services.length > 0 ? (
        <div className="services-list">
          {services.map(service => (
            <div
              key={service.id}
              className={`service-row ${!service.is_active ? 'inactive' : ''}`}
            >
              {/* Name + description */}
              <div>
                <div className="service-row-name">{service.name}</div>
                {service.description && (
                  <div className="service-row-desc">{service.description}</div>
                )}
              </div>

              {/* Price */}
              <div className="service-row-price">
                {service.price} <span>TND</span>
              </div>

              {/* Duration */}
              <div className="service-row-duration">
                ⏱ {service.duration_minutes} min
              </div>

              {/* Category */}
              <div className="service-row-category">{service.category}</div>

              {/* Actions */}
              <div className="row-actions">
                <button
                  className="toggle-btn"
                  onClick={() => toggleActive(service)}
                  title={service.is_active ? 'Désactiver' : 'Activer'}
                >
                  {service.is_active ? '✅' : '⭕'}
                </button>
                <button className="icon-btn" onClick={() => openEdit(service)}>
                  Modifier
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                >
                  {deletingId === service.id ? '...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <p className="empty-state-text">
            Aucun service — ajoutez votre premier service
          </p>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeForm() }}
        >
          <div className="modal">
            <h2 className="modal-title">
              {editingId ? 'Modifier le service' : <>Nouveau <em>service</em></>}
            </h2>

            <div className="form-group">
              <label className="form-label">Nom du service *</label>
              <input
                className="form-input"
                placeholder="Ex: Coupe & Brushing"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Décrivez le service..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prix (TND) *</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="45"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Durée (minutes) *</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="60"
                  value={form.duration_minutes}
                  onChange={e => setForm(p => ({ ...p, duration_minutes: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select
                className="form-select"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeForm}>
                Annuler
              </button>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading || !form.name || !form.price || !form.duration_minutes}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}