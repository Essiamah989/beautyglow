'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    window.location.href = '/dashboard'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --pink: #F4A7B9;
          --pink-deep: #E8799A;
          --pink-soft: #FEF1F5;
          --pink-mid: #FADDEA;
          --slate: #4A5568;
          --slate-dark: #2D3748;
          --slate-light: #718096;
          --cream: #FAF7F5;
          --cream-dark: #F3EDE8;
          --white: #FFFFFF;
          --text: #2D3748;
          --text-light: #718096;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--cream);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* LEFT PANEL */
        .auth-left {
          background: var(--slate-dark);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .auth-left::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(244,167,185,0.15) 0%, transparent 65%);
          bottom: -150px;
          right: -100px;
          pointer-events: none;
        }

        .auth-left::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(244,167,185,0.08) 0%, transparent 65%);
          top: -80px;
          left: -60px;
          pointer-events: none;
        }

        .left-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }

        .left-logo span { color: var(--pink); }

        .left-content {
          position: relative;
          z-index: 1;
        }

        .left-tag {
          display: inline-block;
          background: rgba(244,167,185,0.15);
          border: 1px solid rgba(244,167,185,0.25);
          color: var(--pink);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 50px;
          margin-bottom: 24px;
        }

        .left-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 20px;
        }

        .left-title em {
          font-style: italic;
          color: var(--pink);
        }

        .left-desc {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.75;
          font-weight: 300;
          max-width: 320px;
          margin-bottom: 40px;
        }

        .left-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .stat-box {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 20px;
        }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--pink);
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          line-height: 1.4;
        }

        .left-bottom {
          position: relative;
          z-index: 1;
        }

        .left-testimonial {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px 24px;
        }

        .testi-text {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-style: italic;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          margin-bottom: 14px;
        }

        .testi-author-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .testi-av {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pink-mid), var(--pink));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .testi-info-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }

        .testi-info-salon {
          font-size: 0.7rem;
          color: var(--pink);
        }

        /* RIGHT PANEL */
        .auth-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: var(--cream);
        }

        .auth-form-wrap {
          width: 100%;
          max-width: 400px;
        }

        .form-eyebrow {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--pink-deep);
          margin-bottom: 10px;
          display: block;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 900;
          color: var(--slate-dark);
          letter-spacing: -0.8px;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .form-title em {
          font-style: italic;
          color: var(--pink-deep);
        }

        .form-sub {
          font-size: 0.88rem;
          color: var(--text-light);
          font-weight: 400;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .field-group {
          margin-bottom: 18px;
        }

        .field-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--slate);
          display: block;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          background: white;
          border: 1.5px solid var(--cream-dark);
          color: var(--slate-dark);
          padding: 14px 18px;
          font-size: 0.92rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400;
          outline: none;
          transition: all 0.2s;
          border-radius: 12px;
        }

        .field-input:focus {
          border-color: var(--pink);
          box-shadow: 0 0 0 4px rgba(244,167,185,0.12);
        }

        .field-input::placeholder { color: #CBD5E0; }

        .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: var(--pink-deep);
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .forgot-link:hover { color: var(--slate-dark); }

        .error-box {
          background: #FFF5F5;
          border: 1px solid #FED7D7;
          color: #C53030;
          padding: 12px 16px;
          font-size: 0.82rem;
          border-radius: 10px;
          margin-bottom: 18px;
          font-weight: 400;
        }

        .btn-submit {
          width: 100%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          background: var(--slate-dark);
          border: none;
          cursor: pointer;
          padding: 15px;
          border-radius: 50px;
          transition: all 0.25s;
          letter-spacing: -0.2px;
          margin-top: 8px;
          box-shadow: 0 4px 20px rgba(45,55,72,0.2);
        }

        .btn-submit:hover:not(:disabled) {
          background: var(--pink-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232,121,154,0.35);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--cream-dark);
        }

        .divider-text {
          font-size: 0.75rem;
          color: var(--text-light);
          font-weight: 400;
          white-space: nowrap;
        }

        .form-footer {
          text-align: center;
          font-size: 0.84rem;
          color: var(--text-light);
        }

        .form-footer a {
          color: var(--pink-deep);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .form-footer a:hover { color: var(--slate-dark); }

        .welcome-back {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid var(--cream-dark);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 28px;
        }

        .welcome-icon {
          font-size: 1.4rem;
        }

        .welcome-text {
          font-size: 0.82rem;
          color: var(--text-light);
          font-weight: 400;
          line-height: 1.5;
        }

        .welcome-text strong {
          color: var(--slate-dark);
          font-weight: 600;
          display: block;
          font-size: 0.88rem;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 40px 24px; align-items: flex-start; padding-top: 60px; }
        }
      `}</style>

      <div className="auth-page">
        {/* LEFT */}
        <div className="auth-left">
          <div className="left-logo" onClick={() => router.push('/')}>
            Beauty<span>Glow</span>.tn
          </div>

          <div className="left-content">
            <div className="left-tag">✦ Bon retour</div>
            <h2 className="left-title">
              Votre dashboard<br />
              vous <em>attend</em>
            </h2>
            <p className="left-desc">
              Gérez vos réservations, services et clientes depuis un seul endroit.
            </p>
            <div className="left-stats">
              {[
                { num: '24/7', label: 'Réservations en ligne' },
                { num: '+40%', label: 'De clientes en moyenne' },
                { num: '5min', label: 'Pour tout configurer' },
                { num: '14j', label: 'Essai gratuit offert' },
              ].map((s, i) => (
                <div key={i} className="stat-box">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="left-bottom">
            <div className="left-testimonial">
              <p className="testi-text">
                &ldquo;Le site est tellement professionnel. Mes clientes pensaient
                que j&apos;avais engagé un développeur !&rdquo;
              </p>
              <div className="testi-author-row">
                <div className="testi-av">L</div>
                <div>
                  <div className="testi-info-name">Latifa M.</div>
                  <div className="testi-info-salon">Salon Latifa, Sfax</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="welcome-back">
              <div className="welcome-icon">✨</div>
              <div className="welcome-text">
                <strong>Bon retour sur BeautyGlow</strong>
                Connectez-vous pour accéder à votre dashboard
              </div>
            </div>

            <span className="form-eyebrow">Connexion</span>
            <h1 className="form-title">
              Content de vous<br /><em>revoir !</em>
            </h1>
            <p className="form-sub">
              Entrez vos identifiants pour accéder à votre espace.
            </p>

            {error && <div className="error-box">⚠ {error}</div>}

            <div className="field-group">
              <label className="field-label">Adresse email</label>
              <input
                className="field-input"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">
              <div className="field-row">
                <label className="field-label">Mot de passe</label>
                <a href="#" className="forgot-link">Mot de passe oublié ?</a>
              </div>
              <input
                className="field-input"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              className="btn-submit"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter →'}
            </button>

            <div className="form-divider">
              <div className="divider-line" />
              <span className="divider-text">Pas encore de compte ?</span>
              <div className="divider-line" />
            </div>

            <p className="form-footer">
              <a href="/auth/signup">Créer mon compte gratuit — 14j offerts →</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}