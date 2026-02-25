// src/app/page.tsx
// BeautyGlow Landing Page — marketing site for salon owners

import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --gold: #b8934a;
  --gold-light: #d4a96a;
  --pink: #f2a8c4;
  --pink-light: #fce4ef;
  --pink-dark: #e07aa0;
  --sky: #7bb8d4;
  --sky-light: #e8f4fa;
  --sky-dark: #4a90b8;
  --white: #ffffff;
  --cream: #fdf8f5;
  --cream-2: #f9f0eb;
  --text: #2a1a12;
  --text-muted: #8a6a5a;
  --text-dim: #c4a898;
  --border: #edd8cc;
}

body {
  background: var(--cream);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
}

/* NAV */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 24px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(253,248,245,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--gold);
  text-decoration: none;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-link {
  font-size: 0.72rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover { color: var(--gold); }

.nav-cta {
  font-size: 0.68rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--white);
  background: var(--pink-dark);
  padding: 11px 28px;
  text-decoration: none;
  transition: background 0.2s;
  font-weight: 600;
  border-radius: 2px;
}

.nav-cta:hover { background: var(--pink); }

/* HERO */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 120px 48px 80px;
  overflow: hidden;
  background: linear-gradient(135deg, #fff5f9 0%, #fdf8f5 40%, #f0f7fc 100%);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 20%, rgba(242,168,196,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 10% 80%, rgba(123,184,212,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(184,147,74,0.08) 0%, transparent 40%);
}

.hero-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(184,147,74,0.12) 1px, transparent 1px);
  background-size: 40px 40px;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-tag {
  font-size: 0.62rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--sky-dark);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 500;
}

.hero-tag::before {
  content: '';
  width: 40px;
  height: 1px;
  background: var(--sky-dark);
  opacity: 0.6;
}

.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3.5rem, 7vw, 7rem);
  font-weight: 300;
  line-height: 1.05;
  color: var(--text);
  margin-bottom: 32px;
  max-width: 800px;
}

.hero-title em {
  font-style: italic;
  color: var(--pink-dark);
}

.hero-sub {
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: 300;
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: 48px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--pink-dark);
  color: var(--white);
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 16px 40px;
  text-decoration: none;
  transition: background 0.2s;
  display: inline-block;
  border-radius: 2px;
}

.btn-primary:hover { background: var(--pink); color: var(--text); }

.btn-secondary {
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 16px 24px;
  border: 1px solid var(--border);
  transition: all 0.2s;
  display: inline-block;
  border-radius: 2px;
}

.btn-secondary:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.hero-stats {
  position: absolute;
  right: 48px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  text-align: right;
}

.hero-stat-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  font-weight: 300;
  color: var(--gold);
  line-height: 1;
  display: block;
}

.hero-stat-label {
  font-size: 0.62rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-dim);
  display: block;
  margin-top: 4px;
}

/* PROBLEM SECTION */
.problem-section {
  padding: 120px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-tag {
  font-size: 0.62rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--sky-dark);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 500;
}

.section-tag::before {
  content: '';
  width: 32px;
  height: 1px;
  background: var(--sky-dark);
  opacity: 0.6;
}

.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.2rem, 4vw, 3.5rem);
  font-weight: 300;
  line-height: 1.2;
  color: var(--text);
  margin-bottom: 64px;
  max-width: 600px;
}

.problem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.problem-card {
  background: var(--white);
  padding: 40px 32px;
  border: 1px solid var(--border);
  border-radius: 4px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.problem-card:hover {
  box-shadow: 0 8px 32px rgba(224,122,160,0.1);
  transform: translateY(-2px);
}

.problem-icon {
  font-size: 1.8rem;
  margin-bottom: 20px;
  display: block;
}

.problem-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 12px;
}

.problem-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.7;
  font-weight: 300;
}

/* SOLUTION */
.solution-section {
  padding: 120px 48px;
  background: linear-gradient(135deg, var(--pink-light) 0%, var(--sky-light) 100%);
}

.solution-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  margin-top: 64px;
}

.step { position: relative; }

.step-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 4rem;
  font-weight: 300;
  color: rgba(184,147,74,0.2);
  line-height: 1;
  margin-bottom: 24px;
  display: block;
}

.step-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 12px;
}

.step-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.7;
  font-weight: 300;
}

.step-accent {
  width: 32px;
  height: 2px;
  background: var(--pink-dark);
  margin-bottom: 24px;
  border-radius: 1px;
}

/* FEATURES */
.features-section {
  padding: 120px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 64px;
}

.feature-card {
  background: var(--white);
  padding: 40px;
  border: 1px solid var(--border);
  border-radius: 4px;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: var(--pink);
  box-shadow: 0 8px 32px rgba(224,122,160,0.08);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 1.4rem;
  margin-bottom: 20px;
  display: block;
  color: var(--pink-dark);
}

.feature-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.7;
  font-weight: 300;
}

/* COMPARISON */
.comparison-section {
  padding: 120px 48px;
  background: var(--cream-2);
}

.comparison-inner {
  max-width: 900px;
  margin: 0 auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 64px;
  background: var(--white);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.comparison-table th {
  padding: 16px 24px;
  font-size: 0.65rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
  text-align: left;
  background: var(--cream);
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
}

.comparison-table th.highlight { color: var(--pink-dark); }

.comparison-table td {
  padding: 14px 24px;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
  font-weight: 300;
}

.comparison-table td.feature-name { color: var(--text); font-weight: 400; }
.comparison-table td.yes { color: var(--pink-dark); font-weight: 500; }
.comparison-table td.no { color: var(--text-dim); }
.comparison-table tr:hover td { background: var(--cream); }

/* PRICING */
.pricing-section {
  padding: 120px 48px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 64px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.pricing-card {
  background: var(--white);
  padding: 48px 40px;
  border: 1px solid var(--border);
  border-radius: 4px;
  position: relative;
}

.pricing-card.featured {
  border-color: var(--pink);
  box-shadow: 0 16px 48px rgba(224,122,160,0.12);
}

.pricing-badge {
  font-size: 0.58rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--white);
  background: var(--pink-dark);
  padding: 4px 12px;
  margin-bottom: 24px;
  display: inline-block;
  font-weight: 600;
  border-radius: 2px;
}

.pricing-plan {
  font-size: 0.65rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 16px;
  display: block;
}

.pricing-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3.5rem;
  font-weight: 300;
  color: var(--gold);
  line-height: 1;
  margin-bottom: 4px;
}

.pricing-period {
  font-size: 0.72rem;
  color: var(--text-dim);
  margin-bottom: 32px;
  display: block;
}

.pricing-features {
  list-style: none;
  margin-bottom: 40px;
}

.pricing-features li {
  font-size: 0.82rem;
  color: var(--text-muted);
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 300;
}

.pricing-features li::before {
  content: '✦';
  color: var(--pink-dark);
  font-size: 0.5rem;
  flex-shrink: 0;
}

.pricing-cta {
  display: block;
  text-align: center;
  padding: 14px;
  font-size: 0.68rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  border-radius: 2px;
}

.pricing-cta.outline {
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.pricing-cta.outline:hover { border-color: var(--gold); color: var(--gold); }

.pricing-cta.filled {
  background: var(--pink-dark);
  color: var(--white);
}

.pricing-cta.filled:hover { background: var(--pink); color: var(--text); }

.trial-note {
  margin-top: 32px;
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 1px;
}

/* TESTIMONIALS */
.testimonials-section {
  padding: 120px 48px;
  background: linear-gradient(135deg, var(--sky-light) 0%, var(--pink-light) 100%);
}

.testimonials-inner { max-width: 1200px; margin: 0 auto; }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 64px;
}

.testimonial-card {
  background: var(--white);
  padding: 40px 32px;
  border: 1px solid var(--border);
  border-radius: 4px;
  transition: transform 0.2s;
}

.testimonial-card:hover { transform: translateY(-2px); }

.testimonial-stars {
  color: var(--gold);
  font-size: 0.75rem;
  letter-spacing: 4px;
  margin-bottom: 20px;
}

.testimonial-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 300;
  font-style: italic;
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 24px;
}

.testimonial-author {
  font-size: 0.65rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 500;
}

.testimonial-salon {
  font-size: 0.65rem;
  color: var(--pink-dark);
  margin-top: 4px;
  display: block;
  letter-spacing: 1px;
}

/* CTA */
.cta-section {
  padding: 160px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--cream);
}

.cta-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 50%, rgba(242,168,196,0.2) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 50%, rgba(123,184,212,0.15) 0%, transparent 60%);
}

.cta-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300;
  color: var(--text);
  margin-bottom: 24px;
  position: relative;
}

.cta-title em { color: var(--pink-dark); font-style: italic; }

.cta-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 48px;
  font-weight: 300;
  position: relative;
  line-height: 1.7;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  position: relative;
}

/* FOOTER */
.footer {
  padding: 40px 48px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  background: var(--white);
}

.footer-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  color: var(--gold);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.footer-links { display: flex; gap: 32px; flex-wrap: wrap; }

.footer-link {
  font-size: 0.65rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover { color: var(--pink-dark); }

.footer-copy {
  font-size: 0.65rem;
  color: var(--text-dim);
  letter-spacing: 1px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .nav { padding: 20px 24px; }
  .hero { padding: 100px 24px 120px; }
  .hero-stats { display: none; }
  .problem-grid, .steps-grid, .features-grid, .testimonials-grid { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
  .problem-section, .features-section, .pricing-section { padding: 80px 24px; }
  .solution-section, .comparison-section, .testimonials-section { padding: 80px 24px; }
  .cta-section { padding: 100px 24px; }
  .footer { padding: 32px 24px; flex-direction: column; text-align: center; }
  .footer-links { justify-content: center; }
}

@media (max-width: 600px) {
  .nav-links .nav-link { display: none; }
  .hero-title { font-size: 2.8rem; }
}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          BeautyGlow
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">
            Fonctionnalités
          </a>
          <a href="#pricing" className="nav-link">
            Tarifs
          </a>
          <a href="/auth/login" className="nav-link">
            Connexion
          </a>
          <a href="/auth/signup" className="nav-cta">
            Essai gratuit
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid-lines" />
        <div className="hero-content">
          <div className="hero-tag">Plateforme N°1 pour salons en Tunisie</div>
          <h1 className="hero-title">
            Votre salon mérite
            <br />
            <em>plus qu'Instagram</em>
          </h1>
          <p className="hero-sub">
            Site web professionnel + réservation en ligne en 5 minutes. Vos
            clientes réservent 24h/24 — vous ne ratez plus aucun rendez-vous.
          </p>
          <div className="hero-actions">
            <a href="/auth/signup" className="btn-primary">
              Commencer gratuitement →
            </a>
            <a href="#features" className="btn-secondary">
              Voir comment ça marche
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <span className="hero-stat-number">5 min</span>
            <span className="hero-stat-label">Pour tout configurer</span>
          </div>
          <div>
            <span className="hero-stat-number">14j</span>
            <span className="hero-stat-label">D'essai gratuit</span>
          </div>
          <div>
            <span className="hero-stat-number">89 TND</span>
            <span className="hero-stat-label">Par mois seulement</span>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section
        style={{ padding: "120px 48px", borderTop: "1px solid #1a1a1a" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-tag">Le problème</div>
          <h2 className="section-title">
            80% des salons tunisiens perdent des clientes chaque jour
          </h2>
          <div className="problem-grid">
            <div className="problem-card">
              <span className="problem-icon">📵</span>
              <h3 className="problem-title">Appels manqués</h3>
              <p className="problem-desc">
                Vous êtes en plein travail — le téléphone sonne, vous ne pouvez
                pas répondre. La cliente appelle la concurrence.
              </p>
            </div>
            <div className="problem-card">
              <span className="problem-icon">📱</span>
              <h3 className="problem-title">Instagram ne suffit plus</h3>
              <p className="problem-desc">
                Un profil Instagram c'est bien, mais vos clientes ne peuvent pas
                réserver directement. Elles doivent envoyer un message,
                attendre...
              </p>
            </div>
            <div className="problem-card">
              <span className="problem-icon">📋</span>
              <h3 className="problem-title">Agenda papier chaotique</h3>
              <p className="problem-desc">
                Double réservations, rendez-vous oubliés, pas de vue d'ensemble.
                Gérer votre agenda vous prend plus de temps que vos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="solution-section" id="features">
        <div className="solution-inner">
          <div className="section-tag">La solution</div>
          <h2 className="section-title">
            Prêt en 5 minutes,
            <br />
            <em>actif pour toujours</em>
          </h2>
          <div className="steps-grid">
            <div className="step">
              <span className="step-number">01</span>
              <div className="step-accent" />
              <h3 className="step-title">Créez votre compte</h3>
              <p className="step-desc">
                Inscrivez-vous en 2 minutes. Ajoutez le nom de votre salon, vos
                services et vos photos. C'est tout.
              </p>
            </div>
            <div className="step">
              <span className="step-number">02</span>
              <div className="step-accent" />
              <h3 className="step-title">Votre site est en ligne</h3>
              <p className="step-desc">
                Obtenez instantanément votre adresse professionnelle :
                votresalon.beautyglow.tn — partagez-la partout.
              </p>
            </div>
            <div className="step">
              <span className="step-number">03</span>
              <div className="step-accent" />
              <h3 className="step-title">Les réservations arrivent</h3>
              <p className="step-desc">
                Vos clientes réservent en ligne 24h/24. Vous recevez une
                notification et gérez tout depuis votre dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-tag">Ce que vous obtenez</div>
        <h2 className="section-title">Tout ce dont votre salon a besoin</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">✦</span>
            <h3 className="feature-title">Site web professionnel</h3>
            <p className="feature-desc">
              Un vrai site web à votre image — pas juste une page Instagram.
              Design luxueux, rapide, optimisé pour Google.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">◎</span>
            <h3 className="feature-title">Réservation en ligne 24/7</h3>
            <p className="feature-desc">
              Vos clientes réservent même à minuit. Plus d'appels manqués, plus
              de messages WhatsApp sans réponse.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">◉</span>
            <h3 className="feature-title">Dashboard complet</h3>
            <p className="feature-desc">
              Gérez vos réservations, services, photos et clientes depuis un
              tableau de bord simple et élégant.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">◈</span>
            <h3 className="feature-title">Galerie avant/après</h3>
            <p className="feature-desc">
              Montrez vos réalisations avec des photos avant/après par service.
              Vos clientes voient votre travail, elles réservent.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">★</span>
            <h3 className="feature-title">Témoignages clients</h3>
            <p className="feature-desc">
              Affichez les avis de vos clientes satisfaites directement sur
              votre site. La preuve sociale qui convertit.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">◻</span>
            <h3 className="feature-title">Notifications instantanées</h3>
            <p className="feature-desc">
              Recevez un email dès qu'une nouvelle réservation arrive. Confirmez
              en un clic depuis votre dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="comparison-section">
        <div className="comparison-inner">
          <div className="section-tag">Comparaison</div>
          <h2 className="section-title">
            Pourquoi BeautyGlow
            <br />
            et pas la concurrence?
          </h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Fonctionnalité</th>
                <th>Concurrence</th>
                <th className="highlight">BeautyGlow</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature-name">Prix mensuel</td>
                <td>99-199 TND</td>
                <td className="yes">89 TND ✦</td>
              </tr>
              <tr>
                <td className="feature-name">Vrai site web</td>
                <td className="no">✕ Annuaire seulement</td>
                <td className="yes">✓ votresalon.beautyglow.tn</td>
              </tr>
              <tr>
                <td className="feature-name">Réservation en ligne</td>
                <td className="no">✕ WhatsApp manuel</td>
                <td className="yes">✓ Automatique 24/7</td>
              </tr>
              <tr>
                <td className="feature-name">Dashboard propriétaire</td>
                <td className="no">✕ Aucun</td>
                <td className="yes">✓ Complet</td>
              </tr>
              <tr>
                <td className="feature-name">Galerie avant/après</td>
                <td className="no">✕</td>
                <td className="yes">✓</td>
              </tr>
              <tr>
                <td className="feature-name">Configuration</td>
                <td>Inconnu</td>
                <td className="yes">✓ 5 minutes</td>
              </tr>
              <tr>
                <td className="feature-name">Essai gratuit</td>
                <td className="no">✕</td>
                <td className="yes">✓ 14 jours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-tag" style={{ justifyContent: "center" }}>
          Tarifs simples
        </div>
        <h2
          className="section-title"
          style={{ margin: "0 auto 0", textAlign: "center" }}
        >
          Un rendez-vous suffit
          <br />à rentabiliser l'abonnement
        </h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <span className="pricing-plan">Basic</span>
            <div className="pricing-price">89</div>
            <span className="pricing-period">TND / mois</span>
            <ul className="pricing-features">
              <li>Site web professionnel</li>
              <li>Réservation en ligne</li>
              <li>Dashboard complet</li>
              <li>Galerie photos</li>
              <li>Avant/après par service</li>
              <li>Notifications email</li>
            </ul>
            <a href="/auth/signup" className="pricing-cta outline">
              Commencer — 14j gratuit
            </a>
          </div>
          <div className="pricing-card featured">
            <span className="pricing-badge">Populaire</span>
            <span className="pricing-plan">Pro</span>
            <div className="pricing-price">149</div>
            <span className="pricing-period">TND / mois</span>
            <ul className="pricing-features">
              <li>Tout le plan Basic</li>
              <li>Domaine personnalisé</li>
              <li>Campagnes email clients</li>
              <li>Statistiques avancées</li>
              <li>Support prioritaire</li>
              <li>Multi-staff (bientôt)</li>
            </ul>
            <a href="/auth/signup" className="pricing-cta filled">
              Commencer — 14j gratuit
            </a>
          </div>
        </div>
        <p className="trial-note">
          ✦ 14 jours d'essai gratuit — Aucune carte bancaire requise
        </p>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div className="section-tag">Ils nous font confiance</div>
          <h2 className="section-title">Ce que disent nos salons</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "Depuis BeautyGlow, je reçois des réservations même la nuit. Mes
                clientes adorent pouvoir réserver depuis leur téléphone."
              </p>
              <div className="testimonial-author">Yasmine B.</div>
              <span className="testimonial-salon">Salon Yasmine, Tunis</span>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "En 5 minutes j'avais mon site en ligne. Le dashboard est
                tellement simple à utiliser. Je recommande à toutes mes
                collègues."
              </p>
              <div className="testimonial-author">Amira T.</div>
              <span className="testimonial-salon">Salon Éclat, Sfax</span>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">
                "J'ai arrêté de perdre des clientes à cause des appels manqués.
                BeautyGlow a changé ma façon de gérer mon salon."
              </p>
              <div className="testimonial-author">Nour M.</div>
              <span className="testimonial-salon">Beauty Nour, Sousse</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="cta-bg" />
        <h2 className="cta-title">
          Prête à faire briller
          <br />
          <em>votre salon en ligne?</em>
        </h2>
        <p className="cta-sub">
          Rejoignez les salons tunisiens qui ont choisi BeautyGlow.
          <br />
          14 jours gratuits — aucune carte bancaire requise.
        </p>
        <div className="cta-actions">
          <a href="/auth/signup" className="btn-primary">
            Créer mon site maintenant →
          </a>
          <a href="/auth/login" className="btn-secondary">
            J'ai déjà un compte
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">BeautyGlow</div>
        <div className="footer-links">
          <a href="#features" className="footer-link">
            Fonctionnalités
          </a>
          <a href="#pricing" className="footer-link">
            Tarifs
          </a>
          <a href="/auth/signup" className="footer-link">
            S'inscrire
          </a>
          <a href="/auth/login" className="footer-link">
            Connexion
          </a>
        </div>
        <div className="footer-copy">© 2026 BeautyGlow — beautyglow.tn</div>
      </footer>
    </>
  );
}
