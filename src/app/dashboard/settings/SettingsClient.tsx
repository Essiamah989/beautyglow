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

        {/* ── Social + Hours ── */}
        <div>

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
            ].map(t => (
              <button
                key={t.id}
                className={`theme-card ${theme === t.id ? 'theme-card--active' : ''}`}
                onClick={() => setTheme(t.id)}
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
                  {theme === t.id && (
                    <div className="theme-preview-check">✓</div>
                  )}
                </div>
                {/* Label */}
                <div className="theme-card-label">
                  <span className="theme-card-name">{t.name}</span>
                  <span className="theme-card-desc">{t.desc}</span>
                </div>
              </button>
            ))}
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