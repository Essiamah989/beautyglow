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

interface BeforeAfter {
  id: string
  service_id: string
  before_url: string
  after_url: string
  caption: string
}

interface Props {
  services: Service[]
  businessId: string
  planType: string
  initialBeforeAfters: BeforeAfter[]
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

export default function ServicesClient({ services: initial, businessId, planType, initialBeforeAfters }: Props) {
  const [services, setServices]   = useState<Service[]>(initial)
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfter[]>(initialBeforeAfters)
  const [showForm, setShowForm]   = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm]           = useState(emptyForm)
  const [loading, setLoading]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Before/After upload state
  const [baBeforeFile, setBaBeforeFile] = useState<File | null>(null)
  const [baAfterFile, setBaAfterFile]   = useState<File | null>(null)
  const [baCaption, setBaCaption]       = useState('')
  const [baUploading, setBaUploading]   = useState(false)

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

  // ── Upload file helper ──
  const uploadFile = async (file: File, prefix: string) => {
    const ext      = file.name.split('.').pop()
    const fileName = `before-after/${businessId}/${prefix}-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('business-asset')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('business-asset')
      .getPublicUrl(fileName)
    return publicUrl
  }

  const handleSaveBA = async () => {
    if (!baBeforeFile || !baAfterFile || !editingId) return
    setBaUploading(true)
    try {
      const beforeUrl = await uploadFile(baBeforeFile, 'before')
      const afterUrl  = await uploadFile(baAfterFile,  'after')

      const { data, error } = await supabase
        .from('before_after_photos')
        .insert({
          business_id: businessId,
          service_id:  editingId,
          before_url:  beforeUrl,
          after_url:   afterUrl,
          caption:     baCaption,
        })
        .select()
        .single()
      if (error) throw error

      setBeforeAfters(prev => [data, ...prev])
      setBaBeforeFile(null)
      setBaAfterFile(null)
      setBaCaption('')
    } catch (err: any) {
      console.error('BA upload failed:', err?.message)
      alert('Erreur lors du téléchargement.')
    } finally {
      setBaUploading(false)
    }
  }

  const handleDeleteBA = async (id: string) => {
    if (!confirm('Supprimer cette transformation?')) return
    try {
      const { error } = await supabase.from('before_after_photos').delete().eq('id', id)
      if (error) throw error
      setBeforeAfters(prev => prev.filter(b => b.id !== id))
    } catch (err: any) {
      console.error('Delete BA failed:', err?.message)
    }
  }

  const currentServiceBA = beforeAfters.filter(ba => ba.service_id === editingId)

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

            {/* ── Before / After Management ── */}
            {editingId && (
              <div className="section-divider" style={{ margin: '30px 0', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '16px' }}>
                  Photos de transformation (Avant / Après)
                </h3>

                {/* Existing BA photos */}
                {currentServiceBA.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {currentServiceBA.map(ba => (
                      <div key={ba.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--cream)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <img src={ba.before_url} alt="Before" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          <img src={ba.after_url} alt="After" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        </div>
                        <div style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          {ba.caption || 'Aucune légende'}
                        </div>
                        <button className="icon-btn danger" onClick={() => handleDeleteBA(ba.id)}>Supprimer</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload new BA */}
                <div style={{ background: 'var(--pink-soft)', padding: '16px', borderRadius: '10px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--pink-deep)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Ajouter une transformation
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Photo Avant</label>
                      <label style={{ display: 'block', padding: '10px', background: 'white', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center', cursor: 'pointer' }}>
                        {baBeforeFile ? '✓ Image choisie' : 'Choisir...'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setBaBeforeFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Photo Après</label>
                      <label style={{ display: 'block', padding: '10px', background: 'white', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'center', cursor: 'pointer' }}>
                        {baAfterFile ? '✓ Image choisie' : 'Choisir...'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setBaAfterFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <input 
                      className="form-input" 
                      placeholder="Légende (ex: Avant/Après Balayage)" 
                      value={baCaption} 
                      onChange={e => setBaCaption(e.target.value)} 
                    />
                  </div>
                  <button 
                    className="save-btn" 
                    style={{ width: '100%', marginTop: '8px' }}
                    onClick={handleSaveBA}
                    disabled={baUploading || !baBeforeFile || !baAfterFile}
                  >
                    {baUploading ? 'Téléchargement...' : 'Enregistrer la photo'}
                  </button>
                </div>
              </div>
            )}


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