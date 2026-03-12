'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday:    'Lundi',
  tuesday:   'Mardi',
  wednesday: 'Mercredi',
  thursday:  'Jeudi',
  friday:    'Vendredi',
  saturday:  'Samedi',
  sunday:    'Dimanche',
}

export default function SettingsClient({ business }: { business: any }) {
  const [form, setForm] = useState({
    business_name: business.business_name || '',
    phone:         business.phone         || '',
    address:       business.address       || '',
    description:   business.description   || '',
    logo_url:      business.logo_url      || '',
    custom_domain: business.custom_domain || '',
  })

  const [social, setSocial] = useState({
    instagram: business.social_links?.instagram || '',
    facebook:  business.social_links?.facebook  || '',
    whatsapp:  business.social_links?.whatsapp  || '',
  })

  const [hours, setHours] = useState(
    business.opening_hours || {
      monday:    { open: '09:00', close: '18:00', closed: false },
      tuesday:   { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday:  { open: '09:00', close: '18:00', closed: false },
      friday:    { open: '09:00', close: '18:00', closed: false },
      saturday:  { open: '09:00', close: '18:00', closed: false },
      sunday:    { open: '09:00', close: '18:00', closed: true  },
    }
  )

  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [theme,  setTheme]  = useState(business.theme || 'lumiere')
  const [themeSaving, setThemeSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `logos/${business.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('business-asset')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('business-asset')
        .getPublicUrl(fileName)

      setForm(p => ({ ...p, logo_url: publicUrl }))
    } catch (err: any) {
      console.error('Logo upload failed:', err?.message)
      alert('Erreur lors du téléchargement du logo.')
    } finally {
      setLogoUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          business_name: form.business_name,
          phone:         form.phone,
          address:       form.address,
          description:   form.description,
          logo_url:      form.logo_url,
          social_links:  social,
          opening_hours: hours,
          theme,
        })
        .eq('id', business.id)

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error(err?.message)
    } finally {
      setSaving(false)
    }
  }

  const updateHours = (day: string, field: string, value: any) => {
    setHours((prev: any) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  return (
    <>
      <div className="settings-grid">

        {/* ── Business info ── */}
        <div className="settings-section">
          <h2 className="section-title">Informations</h2>

          <div className="form-group">
            <label className="form-label">Logo du salon</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {form.logo_url && (
                <img src={form.logo_url} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eaeaea' }} />
              )}
              <label className="upload-btn" style={{ cursor: 'pointer', padding: '8px 16px', border: '1px solid #eaeaea', borderRadius: '6px', fontSize: '0.85rem' }}>
                {logoUploading ? 'Téléchargement...' : 'Changer de logo'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} disabled={logoUploading} />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nom du salon</label>
            <input
              className="form-input"
              value={form.business_name}
              onChange={e => setForm(p => ({ ...p, business_name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Adresse</label>
            <input
              className="form-input"
              value={form.address}
              onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sous-domaine (non modifiable)</label>
            <div className="subdomain-display">
              {business.subdomain}.beautyglow.tn
            </div>
          </div>
        </div>

        {/* ── Domain + Social ── */}
        <div>
          {/* Custom Domain (Pro Gate) */}
          <div className="settings-section">
            <h2 className="section-title">Domaine personnalisé</h2>
            <p className="section-desc">Utilisez votre propre adresse (ex: www.monsalon.com) au lieu du sous-domaine de base.</p>
            
            {["pro", "elite"].includes(business.plan_type) ? (
              <div className="form-group">
                <label className="form-label">Nom de domaine</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="form-input"
                    placeholder="www.votredomaine.com"
                    value={form.custom_domain}
                    onChange={e => setForm(p => ({ ...p, custom_domain: e.target.value }))}
                  />
                  <button className="upload-btn" style={{ whiteSpace: 'nowrap' }} onClick={() => alert('Veuillez contacter le support pour lier votre domaine.')}>
                    Vérifier
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px' }}>
                  Statut : {business.custom_domain_verified ? '✅ Vérifié' : '⏳ En attente de configuration DNS'}
                </p>
              </div>
            ) : (
              <div className="lock-notice" style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px dashed #ddd', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '8px' }}>🔒</span>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px' }}>Cette fonctionnalité nécessite un plan **Pro** ou **Elite**.</p>
                <button className="upload-btn" style={{ fontSize: '0.75rem' }} onClick={() => alert('Redirection vers les plans...')}>Mettre à niveau</button>
              </div>
            )}
          </div>

          {/* Social links */}
          <div className="settings-section">
            <h2 className="section-title">Réseaux sociaux</h2>

            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input
                className="form-input"
                placeholder="@votresalon"
                value={social.instagram}
                onChange={e => setSocial(p => ({ ...p, instagram: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input
                className="form-input"
                placeholder="facebook.com/votresalon"
                value={social.facebook}
                onChange={e => setSocial(p => ({ ...p, facebook: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp</label>
              <input
                className="form-input"
                placeholder="+216 XX XXX XXX"
                value={social.whatsapp}
                onChange={e => setSocial(p => ({ ...p, whatsapp: e.target.value }))}
              />
            </div>
          </div>

          {/* Opening hours */}
          <div className="settings-section">
            <h2 className="section-title">Horaires d&apos;ouverture</h2>

            {DAYS.map(day => (
              <div key={day} className="hours-row">
                <span className="day-label">{DAY_LABELS[day]}</span>
                <input
                  type="time"
                  className="time-input"
                  value={hours[day]?.open || '09:00'}
                  disabled={hours[day]?.closed}
                  onChange={e => updateHours(day, 'open', e.target.value)}
                />
                <input
                  type="time"
                  className="time-input"
                  value={hours[day]?.close || '18:00'}
                  disabled={hours[day]?.closed}
                  onChange={e => updateHours(day, 'close', e.target.value)}
                />
                <label className="closed-toggle">
                  <input
                    type="checkbox"
                    checked={hours[day]?.closed || false}
                    onChange={e => updateHours(day, 'closed', e.target.checked)}
                  />
                  Fermé
                </label>
              </div>
            ))}
          </div>

        </div>
      </div>


        {/* ── Theme picker ── */}
        <div className="settings-section theme-picker-section">
          <h2 className="section-title">Apparence du site</h2>
          <p className="section-desc">Choisissez le thème visuel de votre site public.</p>

          <div className="theme-grid">
            {[
              {
                id: 'lumiere',
                name: 'Lumière',
                desc: 'Rose & Marine',
                fonts: 'Playfair Display',
                preview: {
                  bg: '#FDF8F5',
                  nav: '#041B2D',
                  accent: '#EA4492',
                  btn: 'linear-gradient(135deg,#EA4492,#FF7A5C)',
                  heading: '#041B2D',
                }
              },
              {
                id: 'blanc',
                name: 'Blanc',
                desc: 'Noir & Ivoire',
                fonts: 'Cormorant Garamond',
                preview: {
                  bg: '#FAFAF8',
                  nav: '#0A0A0A',
                  accent: '#C9A96E',
                  btn: '#0A0A0A',
                  heading: '#0A0A0A',
                }
              },
              {
                id: 'eclat',
                name: 'Éclat',
                desc: 'Or & Espresso',
                fonts: 'Tenor Sans',
                preview: {
                  bg: '#F5EDD8',
                  nav: '#1A110A',
                  accent: '#C9943A',
                  btn: 'linear-gradient(135deg,#C9943A,#E2B96A)',
                  heading: '#1A110A',
                }
              },
              {
                id: 'azur',
                name: 'Azur',
                desc: 'Teal & Sable',
                fonts: 'Fraunces',
                preview: {
                  bg: '#F0F8F8',
                  nav: '#0C6E72',
                  accent: '#5ECDD1',
                  btn: 'linear-gradient(135deg,#0C6E72,#5ECDD1)',
                  heading: '#0C6E72',
                }
              },
            ].map(t => {
              const isLocked = (business.plan_type === 'basic' || business.plan_type === 'trial') && t.id !== 'lumiere';
              return (
              <button
                key={t.id}
                className={`theme-card ${theme === t.id ? 'theme-card--active' : ''}`}
                onClick={() => !isLocked && setTheme(t.id)}
                disabled={isLocked}
                title={isLocked ? 'Plan Pro ou Elite requis' : ''}
                style={isLocked ? { opacity: 0.6, cursor: 'not-allowed', position: 'relative' } : { position: 'relative' }}
              >
                {/* Mini site preview */}
                <div className="theme-preview" style={{ background: t.preview.bg }}>
                  {/* Nav bar */}
                  <div className="theme-preview-nav" style={{ background: t.preview.nav }}>
                    <div className="theme-preview-logo" />
                    <div className="theme-preview-navlinks">
                      <div className="theme-preview-navlink" />
                      <div className="theme-preview-navlink" />
                      <div className="theme-preview-navlink" />
                    </div>
                  </div>
                  {/* Hero */}
                  <div className="theme-preview-hero">
                    <div className="theme-preview-h1" style={{ background: t.preview.heading }} />
                    <div className="theme-preview-h2" style={{ background: t.preview.heading, opacity: 0.5 }} />
                    <div className="theme-preview-btn" style={{ background: t.preview.btn }} />
                  </div>
                  {/* Cards row */}
                  <div className="theme-preview-cards">
                    {[0,1,2].map(i => (
                      <div key={i} className="theme-preview-card" style={{ background: 'white' }}>
                        <div className="theme-preview-card-line" style={{ background: t.preview.accent }} />
                        <div className="theme-preview-card-text" />
                        <div className="theme-preview-card-text short" />
                      </div>
                    ))}
                  </div>
                  {/* Selected check */}
                  {theme === t.id && !isLocked && (
                    <div className="theme-preview-check">✓</div>
                  )}
                  {isLocked && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#111', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, zIndex: 10 }}>Pro</div>
                  )}
                </div>
                {/* Label */}
                <div className="theme-card-label">
                  <span className="theme-card-name">{t.name}</span>
                  <span className="theme-card-desc">{t.desc}</span>
                </div>
              </button>
            )})}
          </div>
        </div>

      {/* ── Save bar ── */}
      <div className="save-bar">
        {saved && (
          <span className="saved-msg">✓ Modifications enregistrées</span>
        )}
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </>
  )
}