'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import '@/styles/auth.css'

/* ── Icons ── */
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const IconArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconStarFilled = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconZap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconLogoMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA4492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
)
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const PERKS = [
  '14 jours gratuits, sans carte bancaire',
  'Site professionnel en 5 minutes',
  'Réservation en ligne 24h/24',
  'Dashboard complet inclus',
  'Support en français inclus',
]

/* ── Component ── */
export default function SignupPage() {
  const router = useRouter()
  const [salonName, setSalonName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignup = async () => {
    if (!email || !password || !salonName) { setError('Veuillez remplir tous les champs.'); return }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { salon_name: salonName } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/onboarding')
  }

  return (
    <div className="auth-page">

      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="left-top">

          <div className="left-logo" onClick={() => router.push('/')}>
            <div className="left-logo-mark"><IconLogoMark /></div>
            <div className="left-logo-text">Beauty<span>Glow</span>.tn</div>
          </div>

          <div className="trial-badge">
            <div className="trial-dot" />
            <span className="trial-badge-text">14 jours gratuits · Aucune carte requise</span>
          </div>

          <div className="left-eyebrow">
            <div className="left-eyebrow-line" />
            <span className="left-eyebrow-text">Rejoindre BeautyGlow</span>
          </div>

          <h2 className="left-title">
            Votre salon en<br />ligne en <em>5 minutes</em>
          </h2>

          <p className="left-desc">
            Rejoignez les salons tunisiens qui ont choisi de briller en ligne.
          </p>

          <div className="perks-list">
            {PERKS.map((p, i) => (
              <div key={i} className="perk">
                <div className="perk-icon"><IconCheck /></div>
                <span className="perk-text">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="left-bottom">
          <div className="review-block">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => <IconStarFilled key={i} />)}
            </div>
            <p className="review-text">
              &#x201C;Mes réservations ont augmenté de 40% dès le premier mois. BeautyGlow a changé mon salon.&#x201D;
            </p>
            <div className="review-author">
              <div className="review-av">A</div>
              <div>
                <div className="review-name">Amira K.</div>
                <div className="review-salon">Beauty Amira, Sousse</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="form-wrap">

          <button className="form-back" onClick={() => router.push('/')}>
            <IconArrowRight /> Retour à l&apos;accueil
          </button>

          <div className="form-eyebrow">
            <div className="form-eyebrow-line" />
            <span className="form-eyebrow-text">Inscription</span>
          </div>

          <h1 className="form-title">
            Commencez<br /><em>gratuitement</em>
          </h1>

          <p className="form-sub">
            Créez votre compte et lancez votre salon en ligne aujourd&apos;hui.
          </p>

          <div className="free-badge">
            <IconZap />
            <span>14 jours gratuits — Aucune carte bancaire</span>
          </div>

          {error && (
            <div className="error-msg">
              <IconAlert /> {error}
            </div>
          )}

          <div className="field">
            <label className="field-label" htmlFor="signup-salon">Nom du salon</label>
            <div className="field-wrap">
              <input
                id="signup-salon"
                className="field-input"
                type="text"
                placeholder="Ex: Salon Yasmine"
                value={salonName}
                onChange={e => setSalonName(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="signup-email">Adresse email</label>
            <div className="field-wrap">
              <input
                id="signup-email"
                className="field-input"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="signup-password">Mot de passe</label>
            <div className="field-wrap">
              <input
                id="signup-password"
                className="field-input has-icon"
                type={showPassword ? 'text' : 'password'}
                placeholder="Au moins 6 caractères"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
              />
              <button className="field-icon" onClick={() => setShowPassword(!showPassword)} aria-label="Afficher/masquer le mot de passe">
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <button className="btn-submit" onClick={handleSignup} disabled={loading}>
            {loading ? (
              <><div className="spinner" /> Création du compte...</>
            ) : (
              <>Créer mon compte gratuit <span className="btn-arrow"><IconArrowRight /></span></>
            )}
          </button>

          <div className="form-trust">
            <div className="trust-item"><IconShield /><span>Données sécurisées</span></div>
            <div className="trust-item"><IconZap /><span>Pas d&apos;engagement</span></div>
            <div className="trust-item"><IconCheck /><span>Annulez à tout moment</span></div>
          </div>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Déjà un compte ?</span>
            <div className="divider-line" />
          </div>

          <p className="form-footer">
            <a href="/auth/login">Se connecter →</a>
          </p>

        </div>
      </div>
    </div>
  )
}