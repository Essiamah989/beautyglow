// src/app/dashboard/photos/PhotosClient.tsx
'use client'

import { useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  category: string
  display_order: number
  is_featured: boolean
}

interface Service {
  id: string
  name: string
}

interface BeforeAfter {
  id: string
  service_id: string
  before_url: string
  after_url: string
  caption: string
}

interface Props {
  photos: Photo[]
  businessId: string
  services: Service[]
  beforeAfters: BeforeAfter[]
  planType: string
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CATEGORIES = ['salon', 'work_examples', 'team']
const CATEGORY_LABELS: Record<string, string> = {
  salon:         'Salon',
  work_examples: 'Réalisations',
  team:          'Équipe',
}

export default function PhotosClient({
  photos: initial,
  businessId,
  services,
  beforeAfters: initialBA,
  planType,
}: Props) {
  const [activeTab, setActiveTab]   = useState<'gallery' | 'before_after'>('gallery')
  const [photos, setPhotos]         = useState<Photo[]>(initial)
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfter[]>(initialBA ?? [])
  const [uploading, setUploading]   = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('salon')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter]         = useState('all')

  // Before/After form state
  const [showBAForm, setShowBAForm]     = useState(false)
  const [baServiceId, setBaServiceId]   = useState('')
  const [baCaption, setBaCaption]       = useState('')
  const [baBeforeFile, setBaBeforeFile] = useState<File | null>(null)
  const [baAfterFile, setBaAfterFile]   = useState<File | null>(null)
  const [baUploading, setBaUploading]   = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const photoLimit = planType === 'basic' || planType === 'trial' ? 10 : planType === 'pro' ? 50 : Infinity
  const canAddMore = photos.length < photoLimit

  // ── Upload gallery photo ──
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canAddMore) {
      alert(`Limite atteinte (${photoLimit} photos pour votre plan). Mettez à niveau pour en ajouter d'autres.`)
      return
    }
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const ext      = file.name.split('.').pop()
        const fileName = `photos/${businessId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('business-asset')
          .upload(fileName, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('business-asset')
          .getPublicUrl(fileName)

        const { data, error: dbError } = await supabase
          .from('photos')
          .insert({
            business_id:   businessId,
            url:           publicUrl,
            category:      selectedCategory,
            display_order: photos.length,
            is_featured:   photos.length === 0,
          })
          .select()
          .single()
        if (dbError) throw dbError
        setPhotos(prev => [...prev, data])
      }
    } catch (err: any) {
      console.error('Upload failed:', err?.message)
      alert('Erreur lors du téléchargement.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Upload file helper (before/after) ──
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

  // ── Save before/after ──
  const handleSaveBA = async () => {
    if (!baBeforeFile || !baAfterFile || !baServiceId) return
    setBaUploading(true)
    try {
      const beforeUrl = await uploadFile(baBeforeFile, 'before')
      const afterUrl  = await uploadFile(baAfterFile,  'after')

      const { data, error } = await supabase
        .from('before_after_photos')
        .insert({
          business_id: businessId,
          service_id:  baServiceId,
          before_url:  beforeUrl,
          after_url:   afterUrl,
          caption:     baCaption,
        })
        .select()
        .single()
      if (error) throw error

      setBeforeAfters(prev => [data, ...prev])
      setShowBAForm(false)
      setBaBeforeFile(null)
      setBaAfterFile(null)
      setBaCaption('')
      setBaServiceId('')
    } catch (err: any) {
      console.error('Before/after save failed:', err?.message)
      alert('Erreur lors du téléchargement.')
    } finally {
      setBaUploading(false)
    }
  }

  // ── Delete before/after ──
  const handleDeleteBA = async (id: string) => {
    if (!confirm('Supprimer cette photo avant/après?')) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from('before_after_photos').delete().eq('id', id)
      if (error) throw error
      setBeforeAfters(prev => prev.filter(b => b.id !== id))
    } catch (err: any) {
      console.error('Delete failed:', err?.message)
    } finally {
      setDeletingId(null)
    }
  }

  // ── Delete gallery photo ──
  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm('Supprimer cette photo?')) return
    setDeletingId(photo.id)
    try {
      const urlParts = photo.url.split('/business-asset/')
      if (urlParts[1]) {
        await supabase.storage.from('business-asset').remove([urlParts[1]])
      }
      const { error } = await supabase.from('photos').delete().eq('id', photo.id)
      if (error) throw error
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
    } catch (err: any) {
      console.error('Delete failed:', err?.message)
    } finally {
      setDeletingId(null)
    }
  }

  // ── Set featured photo ──
  const toggleFeatured = async (photo: Photo) => {
    try {
      await supabase.from('photos').update({ is_featured: false }).eq('business_id', businessId)
      const { error } = await supabase.from('photos').update({ is_featured: true }).eq('id', photo.id)
      if (error) throw error
      setPhotos(prev => prev.map(p => ({ ...p, is_featured: p.id === photo.id })))
    } catch (err: any) {
      console.error('Featured update failed:', err?.message)
    }
  }

  const filtered       = filter === 'all' ? photos : photos.filter(p => p.category === filter)
  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Service inconnu'

  // Guard: no services for before/after
  if (activeTab === 'before_after' && services.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✦</div>
        <p className="empty-state-text">
          Vous devez d&apos;abord ajouter des services avant d&apos;ajouter des photos avant/après.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ── Page tabs ── */}
      <div className="page-tabs">
        <button
          className={`page-tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Galerie ({photos.length})
        </button>
        <button
          className={`page-tab ${activeTab === 'before_after' ? 'active' : ''}`}
          onClick={() => setActiveTab('before_after')}
        >
          Avant / Après ({beforeAfters.length})
        </button>
      </div>

      {/* ════ GALLERY TAB ════ */}
      {activeTab === 'gallery' && (
        <>
          {/* Upload zone */}
          <div className="upload-zone" onClick={() => canAddMore && fileInputRef.current?.click()} style={{ opacity: canAddMore ? 1 : 0.5, cursor: canAddMore ? 'pointer' : 'not-allowed' }}>
            <span className="upload-icon">◻</span>
            <p className="upload-text">
              {canAddMore ? 'Cliquez pour télécharger des photos' : 'Limite de photos atteinte'}
              <br />
              <span>JPG, PNG — plusieurs fichiers acceptés</span>
            </p>
            <div className="upload-controls" onClick={e => e.stopPropagation()}>
              <select
                className="category-select"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
              <button
                className="upload-btn"
                disabled={uploading || !canAddMore}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Téléchargement...' : '+ Ajouter des photos'}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </div>

          {/* Category filters */}
          <div className="filter-tabs">
            {['all', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                className={`filter-tab ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'Toutes' : CATEGORY_LABELS[cat]}
                ({cat === 'all' ? photos.length : photos.filter(p => p.category === cat).length})
              </button>
            ))}
          </div>

          <p className="photos-count">
            {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
          </p>

          {filtered.length > 0 ? (
            <div className="photos-grid">
              {filtered.map(photo => (
                <div key={photo.id} className="photo-item">
                  <Image
                    src={photo.url}
                    alt="Photo du salon"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="photo-overlay">
                    <div className="photo-badges">
                      <span className="photo-badge">
                        {CATEGORY_LABELS[photo.category]}
                      </span>
                      {photo.is_featured && (
                        <span className="photo-badge featured">★ Principale</span>
                      )}
                    </div>
                    <div className="photo-actions">
                      {!photo.is_featured && (
                        <button
                          className="photo-action-btn"
                          onClick={() => toggleFeatured(photo)}
                        >
                          ★ Principale
                        </button>
                      )}
                      <button
                        className="photo-action-btn danger"
                        onClick={() => handleDeletePhoto(photo)}
                        disabled={deletingId === photo.id}
                      >
                        {deletingId === photo.id ? '...' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◻</div>
              <p className="empty-state-text">Aucune photo — ajoutez vos premières photos</p>
            </div>
          )}
        </>
      )}

      {/* ════ BEFORE/AFTER TAB ════ */}
      {activeTab === 'before_after' && (
        <>
          <div className="ba-header">
            <p className="ba-header-count">
              {beforeAfters.length} transformation{beforeAfters.length !== 1 ? 's' : ''}
            </p>
            <button className="add-btn" onClick={() => setShowBAForm(true)}>
              + Ajouter avant/après
            </button>
          </div>

          {beforeAfters.length > 0 ? (
            <div className="ba-grid">
              {beforeAfters.map(ba => (
                <div key={ba.id} className="ba-row">
                  <div className="ba-images-mini">
                    <div className="ba-img-mini">
                      <span className="ba-mini-label">Avant</span>
                      <Image src={ba.before_url} alt="Avant" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="ba-img-mini">
                      <span className="ba-mini-label">Après</span>
                      <Image src={ba.after_url} alt="Après" fill style={{ objectFit: 'cover' }} />
                    </div>
                  </div>

                  <div>
                    <div className="ba-info-service">{getServiceName(ba.service_id)}</div>
                    {ba.caption && (
                      <div className="ba-info-caption">"{ba.caption}"</div>
                    )}
                  </div>

                  <button
                    className="icon-btn danger"
                    onClick={() => handleDeleteBA(ba.id)}
                    disabled={deletingId === ba.id}
                  >
                    {deletingId === ba.id ? '...' : 'Supprimer'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">◈</div>
              <p className="empty-state-text">Aucune transformation — ajoutez vos avant/après</p>
            </div>
          )}
        </>
      )}

      {/* ════ BEFORE/AFTER MODAL ════ */}
      {showBAForm && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowBAForm(false) }}
        >
          <div className="modal">
            <h2 className="modal-title">Nouvelle <em>transformation</em></h2>

            <div className="form-group">
              <label className="form-label">Service concerné *</label>
              <select
                className="form-select"
                value={baServiceId}
                onChange={e => setBaServiceId(e.target.value)}
              >
                <option value="">-- Choisir un service --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Photo Avant *</label>
                <label className={`file-input-label ${baBeforeFile ? 'has-file' : ''}`}>
                  {baBeforeFile ? `✓ ${baBeforeFile.name}` : 'Choisir une photo'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => setBaBeforeFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Photo Après *</label>
                <label className={`file-input-label ${baAfterFile ? 'has-file' : ''}`}>
                  {baAfterFile ? `✓ ${baAfterFile.name}` : 'Choisir une photo'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => setBaAfterFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Légende (optionnel)</label>
              <input
                className="form-input"
                placeholder="Ex: Transformation complète — coloration naturelle"
                value={baCaption}
                onChange={e => setBaCaption(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowBAForm(false)}>
                Annuler
              </button>
              <button
                className="save-btn"
                onClick={handleSaveBA}
                disabled={baUploading || !baBeforeFile || !baAfterFile || !baServiceId}
              >
                {baUploading ? 'Téléchargement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}