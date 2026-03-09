'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
const IconLogoMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA4492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconTrendingUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const STATS = [
  { icon: <IconCalendar />, num: '24', suffix: '/7', label: 'Réservations en ligne' },
  { icon: <IconTrendingUp />, num: '+40', suffix: '%', label: 'Réservations en moyenne' },
  { icon: <IconUsers />, num: '5', suffix: 'min', label: 'Pour tout configurer' },
  { icon: <IconStar />, num: '14', suffix: 'j', label: 'Essai gratuit offert' },
]

/* ── Component ── */
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setSignupSuccess(true)
    }
  }, [searchParams])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false); return }
    window.location.href = '/dashboard'
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

          <div className="left-eyebrow">
            <div className="left-eyebrow-line" />
            <span className="left-eyebrow-text">Bon retour</span>
          </div>

          <h2 className="left-title">
            Votre dashboard<br />vous <em>attend</em>
          </h2>

          <p className="left-desc">
            Gérez vos réservations, clientes et services depuis un seul endroit.
          </p>

          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-num">{s.num}<span>{s.suffix}</span></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="left-bottom">
          <div className="testi-card">
            <p className="testi-quote">
              &#x201C;Le site est tellement professionnel. Mes clientes pensaient que j&apos;avais engagé un développeur !&#x201D;
            </p>
            <div className="testi-author">
              <div className="testi-av">L</div>
              <div>
                <div className="testi-name">Latifa M.</div>
                <div className="testi-salon">Salon Latifa, Sfax</div>
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
            <span className="form-eyebrow-text">Connexion</span>
          </div>

          <h1 className="form-title">
            Content de vous<br /><em>revoir !</em>
          </h1>

          <p className="form-sub">
            Entrez vos identifiants pour accéder à votre espace.
          </p>

          {signupSuccess && (
            <div className="success-msg">
              ✓ Compte créé avec succès ! Connectez-vous pour continuer.
            </div>
          )}

          {error && (
            <div className="error-msg">
              <IconAlert /> {error}
            </div>
          )}

          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="login-email">Adresse email</label>
            </div>
            <div className="field-wrap">
              <input
                id="login-email"
                className="field-input"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="login-password">Mot de passe</label>
              <button className="field-forgot">Mot de passe oublié ?</button>
            </div>
            <div className="field-wrap">
              <input
                id="login-password"
                className="field-input has-icon"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button className="field-icon" onClick={() => setShowPassword(!showPassword)} aria-label="Afficher/masquer le mot de passe">
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <button className="btn-submit" onClick={handleLogin} disabled={loading}>
            {loading ? (
              <><div className="spinner" /> Connexion...</>
            ) : (
              <>Se connecter <span className="btn-arrow"><IconArrowRight /></span></>
            )}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Pas encore de compte ?</span>
            <div className="divider-line" />
          </div>

          <p className="form-footer">
            <a href="/auth/signup">Créer mon compte — 14 jours gratuits →</a>
          </p>

        </div>
      </div>
    </div>
  )
}