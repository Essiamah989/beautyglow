'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

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

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--white);
          color: var(--text);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* ── NAV ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6%;
          transition: all 0.4s ease;
          background: ${mounted && scrolled ? 'rgba(255,255,255,0.92)' : 'transparent'};
          backdrop-filter: ${mounted && scrolled ? 'blur(20px)' : 'none'};
          border-bottom: ${mounted && scrolled ? '1px solid rgba(244,167,185,0.15)' : 'none'};
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .nav-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--slate-dark);
          letter-spacing: -0.3px;
        }

        .nav-logo-text span {
          color: var(--pink-deep);
        }

        .nav-logo-dot {
          width: 8px;
          height: 8px;
          background: var(--pink);
          border-radius: 50%;
          margin-bottom: 12px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-ghost {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--slate);
          background: none;
          border: none;
          cursor: pointer;
          padding: 9px 18px;
          border-radius: 50px;
          transition: all 0.2s;
        }

        .btn-ghost:hover {
          background: var(--pink-soft);
          color: var(--pink-deep);
        }

        .btn-pill {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--white);
          background: var(--slate-dark);
          border: none;
          cursor: pointer;
          padding: 10px 24px;
          border-radius: 50px;
          transition: all 0.25s;
          letter-spacing: -0.2px;
        }

        .btn-pill:hover {
          background: var(--pink-deep);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(232,121,154,0.35);
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          background: var(--cream);
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 100px 6% 60px;
          gap: 60px;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(244,167,185,0.18) 0%, transparent 65%);
          top: -200px;
          right: -100px;
          pointer-events: none;
        }

        .hero-left { position: relative; z-index: 1; }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid rgba(244,167,185,0.4);
          border-radius: 50px;
          padding: 7px 16px 7px 10px;
          margin-bottom: 28px;
          box-shadow: 0 2px 16px rgba(244,167,185,0.15);
        }

        .eyebrow-pill {
          background: var(--pink);
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 50px;
        }

        .eyebrow-text {
          font-size: 0.78rem;
          color: var(--slate);
          font-weight: 500;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 4.5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -1.5px;
          color: var(--slate-dark);
          margin-bottom: 20px;
        }

        .hero-title em {
          font-style: italic;
          color: var(--pink-deep);
        }

        .hero-desc {
          font-size: 1.05rem;
          color: var(--text-light);
          line-height: 1.75;
          font-weight: 400;
          max-width: 440px;
          margin-bottom: 36px;
        }

        .hero-cta-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        .btn-hero-primary {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          background: var(--slate-dark);
          border: none;
          cursor: pointer;
          padding: 15px 32px;
          border-radius: 50px;
          transition: all 0.25s;
          letter-spacing: -0.3px;
          box-shadow: 0 4px 20px rgba(45,55,72,0.25);
        }

        .btn-hero-primary:hover {
          background: var(--pink-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232,121,154,0.4);
        }

        .btn-hero-link {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--slate);
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
          padding: 0;
        }

        .btn-hero-link:hover { color: var(--pink-deep); }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-light);
          font-weight: 400;
        }

        .trust-check {
          width: 20px;
          height: 20px;
          background: var(--pink-mid);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          color: var(--pink-deep);
          flex-shrink: 0;
        }

        /* HERO RIGHT - Visual */
        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .hero-visual-main {
          background: white;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 24px 80px rgba(74,85,104,0.14);
          width: 100%;
          max-width: 380px;
          position: relative;
        }

        .visual-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .visual-salon-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--slate-dark);
        }

        .visual-badge {
          background: var(--pink-soft);
          color: var(--pink-deep);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 4px 10px;
          border-radius: 50px;
          border: 1px solid var(--pink-mid);
        }

        .visual-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .visual-stat {
          background: var(--cream);
          border-radius: 12px;
          padding: 14px 10px;
          text-align: center;
        }

        .visual-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--slate-dark);
          line-height: 1;
          margin-bottom: 4px;
        }

        .visual-stat-label {
          font-size: 0.62rem;
          color: var(--text-light);
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .visual-bookings-title {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--slate);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .visual-booking-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 10px;
          background: var(--cream);
          margin-bottom: 8px;
          transition: background 0.15s;
        }

        .visual-booking-row:last-child { margin-bottom: 0; }

        .visual-booking-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .booking-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pink), var(--pink-deep));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .booking-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--slate-dark);
          margin-bottom: 1px;
        }

        .booking-service {
          font-size: 0.7rem;
          color: var(--text-light);
          font-weight: 400;
        }

        .booking-time {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--pink-deep);
          background: var(--pink-soft);
          padding: 4px 10px;
          border-radius: 50px;
        }

        /* Floating cards */
        .float-card {
          position: absolute;
          background: white;
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 0 8px 32px rgba(74,85,104,0.12);
          white-space: nowrap;
        }

        .float-card-1 {
          top: -20px;
          left: -40px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .float-icon {
          width: 36px;
          height: 36px;
          background: var(--pink-soft);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .float-card-text-main {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--slate-dark);
          margin-bottom: 1px;
        }

        .float-card-text-sub {
          font-size: 0.68rem;
          color: var(--text-light);
        }

        .float-card-2 {
          bottom: 20px;
          right: -30px;
          text-align: center;
        }

        .float-card-2-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--pink-deep);
          line-height: 1;
        }

        .float-card-2-text {
          font-size: 0.68rem;
          color: var(--text-light);
          margin-top: 2px;
        }

        /* ── SECTION BASE ── */
        section {
          padding: 100px 6%;
        }

        .section-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--pink-deep);
          display: block;
          margin-bottom: 14px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.9rem, 3.5vw, 2.8rem);
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1.1;
          color: var(--slate-dark);
          margin-bottom: 14px;
        }

        .section-title em {
          font-style: italic;
          color: var(--pink-deep);
        }

        .section-sub {
          font-size: 1rem;
          color: var(--text-light);
          line-height: 1.75;
          font-weight: 400;
          max-width: 520px;
        }

        /* ── LOGOS STRIP ── */
        .logos-strip {
          background: var(--cream-dark);
          padding: 32px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          overflow: hidden;
          flex-wrap: wrap;
        }

        .logos-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-light);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .logos-items {
          display: flex;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .logo-salon {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--slate-light);
          opacity: 0.7;
          white-space: nowrap;
        }

        /* ── PROBLEM ── */
        .problem-section {
          background: var(--slate-dark);
        }

        .problem-section .section-title { color: white; }
        .problem-section .section-sub { color: rgba(255,255,255,0.5); }
        .problem-section .section-tag { color: var(--pink); }

        .problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-top: 56px;
        }

        .problem-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px 28px;
          transition: all 0.3s;
        }

        .problem-card:hover {
          background: rgba(244,167,185,0.08);
          border-color: rgba(244,167,185,0.2);
          transform: translateY(-4px);
        }

        .problem-emoji {
          font-size: 2rem;
          margin-bottom: 18px;
          display: block;
        }

        .problem-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
        }

        .problem-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.75;
          font-weight: 300;
        }

        /* ── HOW IT WORKS ── */
        .how-section {
          background: var(--cream);
        }

        .how-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin-top: 0;
        }

        .how-left { }

        .steps-list {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .step-item {
          display: flex;
          gap: 20px;
          position: relative;
          padding-bottom: 32px;
        }

        .step-item:last-child { padding-bottom: 0; }

        .step-item::before {
          content: '';
          position: absolute;
          left: 19px;
          top: 44px;
          bottom: 0;
          width: 2px;
          background: var(--pink-mid);
        }

        .step-item:last-child::before { display: none; }

        .step-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--pink-soft);
          border: 2px solid var(--pink-mid);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--pink-deep);
          flex-shrink: 0;
          z-index: 1;
          transition: all 0.2s;
        }

        .step-item:hover .step-dot {
          background: var(--pink);
          border-color: var(--pink);
          color: white;
        }

        .step-text { padding-top: 8px; }

        .step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--slate-dark);
          margin-bottom: 6px;
        }

        .step-desc {
          font-size: 0.85rem;
          color: var(--text-light);
          line-height: 1.7;
          font-weight: 400;
        }

        .how-right {
          background: white;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 20px 60px rgba(74,85,104,0.1);
        }

        .mini-site-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--cream-dark);
        }

        .dot-row { display: flex; gap: 5px; }
        .dot-r { width: 10px; height: 10px; border-radius: 50%; }
        .dot-r.red { background: #FC5F5A; }
        .dot-r.yellow { background: #FDBA2C; }
        .dot-r.green { background: #33CA5E; }

        .mini-url {
          flex: 1;
          background: var(--cream);
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 0.72rem;
          color: var(--text-light);
          font-weight: 500;
          text-align: center;
        }

        .mini-site-body { }

        .mini-hero-img {
          height: 100px;
          background: linear-gradient(135deg, var(--pink-mid) 0%, var(--cream-dark) 100%);
          border-radius: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .mini-hero-img::after {
          content: '✨';
          font-size: 2rem;
          opacity: 0.5;
        }

        .mini-salon-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--slate-dark);
          margin-bottom: 4px;
        }

        .mini-salon-sub {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-bottom: 16px;
        }

        .mini-services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .mini-service {
          background: var(--cream);
          border-radius: 10px;
          padding: 12px;
        }

        .mini-service-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--slate-dark);
          margin-bottom: 2px;
        }

        .mini-service-price {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--pink-deep);
        }

        .mini-book-btn {
          width: 100%;
          background: var(--slate-dark);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: default;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── FEATURES ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 56px;
        }

        .feature-card {
          background: var(--cream);
          border: 1px solid transparent;
          border-radius: 20px;
          padding: 32px 28px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: white;
          border-color: var(--pink-mid);
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(244,167,185,0.15);
        }

        .feat-icon {
          width: 52px;
          height: 52px;
          background: var(--pink-soft);
          border: 1px solid var(--pink-mid);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .feat-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--slate-dark);
          margin-bottom: 8px;
        }

        .feat-desc {
          font-size: 0.84rem;
          color: var(--text-light);
          line-height: 1.75;
          font-weight: 400;
        }

        /* ── PRICING ── */
        .pricing-section {
          background: var(--cream);
          text-align: center;
        }

        .pricing-section .section-sub { margin: 0 auto; }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 56px;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }

        .price-card {
          background: white;
          border: 1.5px solid var(--cream-dark);
          border-radius: 24px;
          padding: 40px 32px;
          text-align: left;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .price-card.featured {
          border-color: var(--pink);
          box-shadow: 0 20px 60px rgba(244,167,185,0.25);
        }

        .price-card:hover {
          transform: translateY(-6px);
        }

        .price-featured-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--pink), var(--pink-deep));
        }

        .price-plan-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-light);
          margin-bottom: 20px;
        }

        .price-card.featured .price-plan-badge { color: var(--pink-deep); }

        .price-amount {
          font-family: 'Playfair Display', serif;
          font-size: 3.8rem;
          font-weight: 900;
          color: var(--slate-dark);
          line-height: 1;
          letter-spacing: -2px;
          margin-bottom: 4px;
        }

        .price-period {
          font-size: 0.82rem;
          color: var(--text-light);
          margin-bottom: 28px;
          font-weight: 400;
        }

        .price-divider {
          height: 1px;
          background: var(--cream-dark);
          margin-bottom: 24px;
        }

        .price-features {
          list-style: none;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .price-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.86rem;
          color: var(--text-light);
          font-weight: 400;
          line-height: 1.5;
        }

        .price-feat-check {
          width: 18px;
          height: 18px;
          background: var(--pink-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          color: var(--pink-deep);
          flex-shrink: 0;
          margin-top: 1px;
        }

        .btn-price {
          width: 100%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 15px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: -0.2px;
        }

        .btn-price-outline {
          background: white;
          color: var(--slate-dark);
          border: 1.5px solid var(--slate-dark);
        }

        .btn-price-outline:hover {
          background: var(--slate-dark);
          color: white;
          transform: translateY(-2px);
        }

        .btn-price-fill {
          background: var(--slate-dark);
          color: white;
          box-shadow: 0 6px 20px rgba(45,55,72,0.25);
        }

        .btn-price-fill:hover {
          background: var(--pink-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232,121,154,0.4);
        }

        /* ── TESTIMONIALS ── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 56px;
        }

        .testi-card {
          background: white;
          border: 1px solid var(--cream-dark);
          border-radius: 20px;
          padding: 32px 28px;
          transition: all 0.3s;
        }

        .testi-card:hover {
          border-color: var(--pink-mid);
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(244,167,185,0.12);
        }

        .testi-stars {
          color: var(--pink);
          font-size: 0.85rem;
          letter-spacing: 3px;
          margin-bottom: 16px;
        }

        .testi-quote {
          font-size: 0.92rem;
          color: var(--slate-dark);
          line-height: 1.8;
          font-weight: 400;
          font-style: italic;
          margin-bottom: 24px;
          font-family: 'Playfair Display', serif;
        }

        .testi-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testi-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pink-mid), var(--pink));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .testi-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--slate-dark);
          margin-bottom: 2px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .testi-salon {
          font-size: 0.74rem;
          color: var(--pink-deep);
          font-weight: 500;
        }

        /* ── CTA BAND ── */
        .cta-band {
          background: var(--slate-dark);
          padding: 100px 6%;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 48px;
        }

        .cta-band .section-title { color: white; margin-bottom: 8px; }
        .cta-band .section-tag { margin-bottom: 10px; }

        .cta-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.5);
          font-weight: 400;
          line-height: 1.6;
        }

        .cta-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn-cta-main {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--slate-dark);
          background: white;
          border: none;
          cursor: pointer;
          padding: 16px 36px;
          border-radius: 50px;
          transition: all 0.25s;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .btn-cta-main:hover {
          background: var(--pink);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(244,167,185,0.4);
        }

        .cta-note {
          font-size: 0.74rem;
          color: rgba(255,255,255,0.3);
          font-weight: 400;
        }

        /* ── FOOTER ── */
        footer {
          background: #1A202C;
          padding: 48px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
        }

        .footer-logo span { color: var(--pink); }

        .footer-links {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }

        .footer-links a {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s;
        }

        .footer-links a:hover { color: var(--pink); }

        .footer-copy {
          font-size: 0.76rem;
          color: rgba(255,255,255,0.2);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 110px 6% 60px;
          }

          .hero-desc { margin-left: auto; margin-right: auto; }

          .hero-cta-row { justify-content: center; }

          .hero-trust { justify-content: center; }

          .hero-right { display: none; }

          .how-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .cta-band {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .cta-right { align-items: center; }
        }

        @media (max-width: 600px) {
          .nav { padding: 0 5%; }
          section { padding: 72px 5%; }
          .cta-band { padding: 72px 5%; }
          footer { padding: 40px 5%; flex-direction: column; text-align: center; }
          .footer-links { justify-content: center; }
          .hero { padding: 100px 5% 60px; }
          .logos-strip { padding: 28px 5%; flex-direction: column; align-items: flex-start; gap: 16px; }
          .float-card { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push('/')}>
          <div className="nav-logo-text">Beauty<span>Glow</span><span style={{color:'var(--pink)',fontSize:'0.6rem',verticalAlign:'super',marginLeft:'1px'}}>.tn</span></div>
        </div>
        <div className="nav-right">
          <button className="btn-ghost" onClick={() => router.push('/auth/login')}>Se connecter</button>
          <button className="btn-pill" onClick={() => router.push('/auth/signup')}>Essai gratuit</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="eyebrow-pill">Nouveau</span>
            <span className="eyebrow-text">Plateforme #1 pour salons en Tunisie</span>
          </div>
          <h1 className="hero-title">
            Votre salon,<br />
            <em>enfin en ligne</em><br />
            et rentable.
          </h1>
          <p className="hero-desc">
            Créez votre site professionnel avec réservation en ligne en 5 minutes.
            Vos clientes réservent 24h/24 — même quand vous dormez.
          </p>
          <div className="hero-cta-row">
            <button className="btn-hero-primary" onClick={() => router.push('/auth/signup')}>
              Commencer gratuitement
            </button>
            <button className="btn-hero-link" onClick={() => router.push('/auth/login')}>
              Voir une démo <span>→</span>
            </button>
          </div>
          <div className="hero-trust">
            {['14 jours gratuits', 'Aucune carte requise', 'Configuration en 5min'].map((t, i) => (
              <div key={i} className="trust-item">
                <div className="trust-check">✓</div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right">
          {/* Floating card top left */}
          <div className="float-card float-card-1">
            <div className="float-icon">📅</div>
            <div>
              <div className="float-card-text-main">Nouvelle réservation !</div>
              <div className="float-card-text-sub">Amira — Coupe femme · 14h00</div>
            </div>
          </div>

          {/* Main card */}
          <div className="hero-visual-main">
            <div className="visual-header">
              <div className="visual-salon-name">Salon Yasmine</div>
              <div className="visual-badge">En ligne</div>
            </div>
            <div className="visual-stats-row">
              <div className="visual-stat">
                <div className="visual-stat-num">24</div>
                <div className="visual-stat-label">RDV ce mois</div>
              </div>
              <div className="visual-stat">
                <div className="visual-stat-num">98%</div>
                <div className="visual-stat-label">Confirmés</div>
              </div>
              <div className="visual-stat">
                <div className="visual-stat-num">★4.9</div>
                <div className="visual-stat-label">Avis clients</div>
              </div>
            </div>
            <div className="visual-bookings-title">Aujourd&apos;hui</div>
            {[
              { init: 'A', name: 'Amira B.', service: 'Coupe femme', time: '14:00' },
              { init: 'S', name: 'Sonia M.', service: 'Coloration', time: '15:30' },
              { init: 'L', name: 'Leila K.', service: 'Manucure', time: '17:00' },
            ].map((b, i) => (
              <div key={i} className="visual-booking-row">
                <div className="visual-booking-left">
                  <div className="booking-avatar">{b.init}</div>
                  <div>
                    <div className="booking-name">{b.name}</div>
                    <div className="booking-service">{b.service}</div>
                  </div>
                </div>
                <div className="booking-time">{b.time}</div>
              </div>
            ))}
          </div>

          {/* Floating card bottom right */}
          <div className="float-card float-card-2">
            <div className="float-card-2-num">+40%</div>
            <div className="float-card-2-text">réservations</div>
          </div>
        </div>
      </section>

      {/* LOGOS STRIP */}
      <div className="logos-strip">
        <span className="logos-label">Ils nous font confiance</span>
        <div className="logos-items">
          {['Salon Belle', 'Chic Beauty', 'Élite Coiffure', 'Studio Amira', 'Glam Tunis'].map((s, i) => (
            <div key={i} className="logo-salon">{s}</div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="problem-section">
        <span className="section-tag">Le vrai problème</span>
        <h2 className="section-title">Vous perdez des clientes<br /><em>chaque jour</em> sans le savoir</h2>
        <p className="section-sub">80% des salons tunisiens dépendent encore des appels manqués et des DMs Instagram.</p>
        <div className="problem-grid">
          {[
            { icon: '📵', title: 'Appels manqués', desc: 'Une cliente appelle, personne ne répond. Elle réserve chez votre concurrente.' },
            { icon: '📱', title: 'Instagram ne suffit plus', desc: 'Pas de réservation en ligne, pas de tarifs clairs, pas d\'image professionnelle.' },
            { icon: '📋', title: 'Chaos de gestion', desc: 'Papier, WhatsApp, mémoire… Les double-réservations arrivent trop souvent.' },
            { icon: '🌙', title: 'Fermé la nuit', desc: 'Vos clientes pensent à réserver à 22h. Votre téléphone est éteint.' },
          ].map((p, i) => (
            <div key={i} className="problem-card">
              <span className="problem-emoji">{p.icon}</span>
              <div className="problem-title">{p.title}</div>
              <div className="problem-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-layout">
          <div className="how-left">
            <span className="section-tag">Comment ça marche</span>
            <h2 className="section-title">En ligne en<br /><em>5 minutes</em> chrono</h2>
            <p className="section-sub">Pas de compétences techniques requises. Vraiment.</p>
            <div className="steps-list">
              {[
                { n: '1', title: 'Créez votre compte', desc: 'Nom du salon, téléphone, adresse. 2 minutes max.' },
                { n: '2', title: 'Ajoutez vos services', desc: 'Prix, durée, catégorie. Votre menu en ligne est prêt.' },
                { n: '3', title: 'Choisissez votre thème', desc: 'Un design luxueux adapté à votre identité visuelle.' },
                { n: '4', title: 'Partagez votre lien', desc: 'monsalon.beautyglow.tn — vos clientes réservent instantanément.' },
              ].map((s, i) => (
                <div key={i} className="step-item">
                  <div className="step-dot">{s.n}</div>
                  <div className="step-text">
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-right">
            <div className="mini-site-header">
              <div className="dot-row">
                <div className="dot-r red" />
                <div className="dot-r yellow" />
                <div className="dot-r green" />
              </div>
              <div className="mini-url">yasmine.beautyglow.tn</div>
            </div>
            <div className="mini-site-body">
              <div className="mini-hero-img" />
              <div className="mini-salon-name">Salon Yasmine</div>
              <div className="mini-salon-sub">📍 Avenue Habib Bourguiba, Tunis</div>
              <div className="mini-services">
                {[
                  { name: 'Coupe femme', price: '35 TND' },
                  { name: 'Coloration', price: '80 TND' },
                  { name: 'Brushing', price: '25 TND' },
                  { name: 'Manucure', price: '20 TND' },
                ].map((s, i) => (
                  <div key={i} className="mini-service">
                    <div className="mini-service-name">{s.name}</div>
                    <div className="mini-service-price">{s.price}</div>
                  </div>
                ))}
              </div>
              <button className="mini-book-btn">Réserver un rendez-vous →</button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section>
        <span className="section-tag">Fonctionnalités</span>
        <h2 className="section-title">Tout ce dont votre salon<br /><em>a vraiment besoin</em></h2>
        <div className="features-grid">
          {[
            { icon: '🌐', title: 'Site web professionnel', desc: 'Votre propre adresse monsalon.beautyglow.tn avec un design luxueux, rapide et mobile-first.' },
            { icon: '📅', title: 'Réservation en ligne 24/7', desc: 'Vos clientes réservent quand elles veulent. Vous confirmez d\'un seul clic depuis le dashboard.' },
            { icon: '📊', title: 'Dashboard complet', desc: 'RDV, services, photos, clientes et statistiques. Tout au même endroit, simple et clair.' },
            { icon: '🖼️', title: 'Galerie & Avant/Après', desc: 'Montrez votre travail. Les photos convertissent bien mieux que les mots.' },
            { icon: '📧', title: 'Notifications instantanées', desc: 'Recevez un email à chaque nouvelle réservation. Ne ratez plus jamais une cliente.' },
            { icon: '🎨', title: 'Thèmes personnalisables', desc: 'Lumière, Blanc, Éclat ou Azur. Choisissez l\'identité qui correspond à votre salon.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section">
        <span className="section-tag">Tarifs simples</span>
        <h2 className="section-title">Un rendez-vous suffit<br />à <em>rentabiliser</em></h2>
        <p className="section-sub">Pas d&apos;engagement. Annulez quand vous voulez.</p>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-plan-badge">BASIC</div>
            <div className="price-amount">89</div>
            <div className="price-period">TND / mois</div>
            <div className="price-divider" />
            <ul className="price-features">
              {['Site web professionnel', 'Réservation en ligne', 'Dashboard complet', 'Galerie photos', 'Avant/après par service', 'Notifications email'].map((f, i) => (
                <li key={i}><div className="price-feat-check">✓</div><span>{f}</span></li>
              ))}
            </ul>
            <button className="btn-price btn-price-outline" onClick={() => router.push('/auth/signup')}>
              Commencer — 14j gratuit
            </button>
          </div>
          <div className="price-card featured">
            <div className="price-featured-bar" />
            <div className="price-plan-badge">PRO — POPULAIRE</div>
            <div className="price-amount">149</div>
            <div className="price-period">TND / mois</div>
            <div className="price-divider" />
            <ul className="price-features">
              {['Tout le plan Basic', 'Domaine personnalisé', 'Campagnes email clients', 'Statistiques avancées', 'Support prioritaire', 'Multi-staff (bientôt)'].map((f, i) => (
                <li key={i}><div className="price-feat-check">✓</div><span>{f}</span></li>
              ))}
            </ul>
            <button className="btn-price btn-price-fill" onClick={() => router.push('/auth/signup')}>
              Commencer — 14j gratuit
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <span className="section-tag">Témoignages</span>
        <h2 className="section-title">Elles nous font <em>confiance</em></h2>
        <div className="testimonials-grid">
          {[
            { init: 'Y', name: 'Yasmine B.', salon: 'Salon Yasmine, Tunis', text: 'Avant BeautyGlow, je perdais des clientes à cause des appels manqués. Maintenant elles réservent la nuit et je vois tout dans mon dashboard le matin.' },
            { init: 'L', name: 'Latifa M.', salon: 'Salon Latifa, Sfax', text: 'Le site est tellement professionnel. Mes clientes pensaient que j\'avais engagé un développeur ! J\'ai tout configuré moi-même en 10 minutes.' },
            { init: 'A', name: 'Amira K.', salon: 'Beauty Amira, Sousse', text: 'Mes réservations ont augmenté de 40% dès le premier mois. Le système de réservation en ligne change vraiment la vie.' },
          ].map((t, i) => (
            <div key={i} className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">&ldquo;{t.text}&rdquo;</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.init}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-salon">{t.salon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <div className="cta-band">
        <div>
          <span className="section-tag">Prête à briller ?</span>
          <h2 className="section-title">Lancez votre salon<br />en ligne <em>aujourd&apos;hui</em></h2>
          <p className="cta-sub">14 jours gratuits. Aucune carte bancaire. Configuration en 5 minutes.</p>
        </div>
        <div className="cta-right">
          <button className="btn-cta-main" onClick={() => router.push('/auth/signup')}>
            Créer mon site gratuitement →
          </button>
          <span className="cta-note">✦ Aucun engagement — Annulez quand vous voulez</span>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Beauty<span>Glow</span>.tn</div>
        <div className="footer-links">
          <a href="#">Accueil</a>
          <a href="#">Tarifs</a>
          <a href="#">Contact</a>
          <a href="#">Confidentialité</a>
        </div>
        <div className="footer-copy">© 2026 BeautyGlow. Tous droits réservés.</div>
      </footer>
    </>
  )
}