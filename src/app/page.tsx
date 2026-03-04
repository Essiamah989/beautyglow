'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* ── Inline SVG Icons ── */
const ICalendar  = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IGlobe     = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IBar       = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const IImage     = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const IMail      = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IPalette   = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const IPhone     = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const IClock     = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IArrow     = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IArrowL    = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const ICheck     = ({s=10}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IStar      = ({s=13}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const ITrend     = ({s=16}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IZap       = ({s=12}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IPin       = ({s=11}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IShield    = ({s=12}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IUsers     = ({s=16}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>

const LOGO = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
)

/* ── Chrome frame wrapper — bright white/pinkish ── */
function FrameChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div style={{ background:'#FFFFFF', border:'1px solid rgba(234,68,146,0.14)', borderRadius:20, overflow:'hidden', boxShadow:'0 28px 72px rgba(4,27,45,0.28), 0 0 0 1px rgba(234,68,146,0.08)' }}>
      <div style={{ background:'#FFF5FA', borderBottom:'1px solid rgba(234,68,146,0.1)', padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', gap:5 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }} />)}
        </div>
        <div style={{ flex:1, background:'rgba(234,68,146,0.07)', borderRadius:5, padding:'4px 12px', fontSize:'0.65rem', color:'rgba(150,60,100,0.5)', textAlign:'center' }}>{url}</div>
        <div style={{ width:56 }} />
      </div>
      <div style={{ padding:20, background:'#FFFBFD' }}>{children}</div>
    </div>
  )
}

/* ── SLIDE 1: Dashboard ── */
function SlideDashboard() {
  return (
    <FrameChrome url="dashboard.beautyglow.tn">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, color:'#1A0A12', fontSize:'0.95rem' }}>Bonjour, Yasmine ✦</div>
          <div style={{ fontSize:'0.6rem', color:'#C07090', marginTop:2 }}>Lundi 2 mars 2026</div>
        </div>
        <div style={{ background:'#FFF0F8', border:'1px solid rgba(234,68,146,0.25)', borderRadius:20, padding:'4px 10px', fontSize:'0.6rem', fontWeight:700, color:'#EA4492', display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#EA4492', animation:'pulse 2s infinite' }} />
          En ligne
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
        {[
          { icon:<ICalendar s={13}/>, num:'8',    label:"Aujourd'hui" },
          { icon:<ITrend s={13}/>,    num:'94%',  label:'Confirmés' },
          { icon:<IStar s={13}/>,     num:'4.9',  label:'Avis' },
        ].map((s,i) => (
          <div key={i} style={{ background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.12)', borderRadius:10, padding:'11px 10px' }}>
            <div style={{ width:26, height:26, background:'rgba(234,68,146,0.1)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', color:'#EA4492', marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.2rem', fontWeight:700, color:'#1A0A12', lineHeight:1, marginBottom:2 }}>{s.num}</div>
            <div style={{ fontSize:'0.56rem', color:'#C07090', textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:'#C07090', marginBottom:8 }}>Rendez-vous du jour</div>
      {[
        { cls:['#EA4492','#F066A8'], init:'A', name:'Amira B.',  svc:'Coupe femme', time:'14:00' },
        { cls:['#004E9A','#428CD4'], init:'S', name:'Sonia M.',  svc:'Coloration',  time:'15:30' },
        { cls:['#7B68EE','#9B88FF'], init:'L', name:'Leila K.',  svc:'Manucure',    time:'17:00' },
      ].map((b,i) => (
        <div key={i} style={{ background:'#FFF8FC', border:'1px solid rgba(234,68,146,0.1)', borderRadius:8, padding:'9px 11px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: i<2 ? 6 : 0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:`linear-gradient(135deg,${b.cls[0]},${b.cls[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'0.62rem', fontWeight:700, color:'white', flexShrink:0 }}>{b.init}</div>
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:600, color:'#1A0A12' }}>{b.name}</div>
              <div style={{ fontSize:'0.58rem', color:'#C07090' }}>{b.svc}</div>
            </div>
          </div>
          <div style={{ fontSize:'0.62rem', fontWeight:700, color:'#EA4492', background:'#FFF0F8', border:'1px solid rgba(234,68,146,0.2)', padding:'2px 8px', borderRadius:20 }}>{b.time}</div>
        </div>
      ))}
    </FrameChrome>
  )
}

/* ── SLIDE 2: Public salon site ── */
function SlideSalon() {
  return (
    <FrameChrome url="yasmine.beautyglow.tn">
      <div style={{ height:68, background:'linear-gradient(135deg,#FFF0F8,#F0F4FF)', borderRadius:10, marginBottom:14, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(234,68,146,0.12)' }}>
        <span style={{ fontFamily:'Playfair Display,serif', fontSize:'1.05rem', fontWeight:700, color:'#1A0A12', fontStyle:'italic' }}>Salon Yasmine</span>
      </div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.88rem', fontWeight:700, color:'#1A0A12', marginBottom:2 }}>Salon Yasmine</div>
      <div style={{ fontSize:'0.62rem', color:'#C07090', display:'flex', alignItems:'center', gap:3, marginBottom:12 }}><IPin s={10}/>Avenue Habib Bourguiba, Tunis</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
        {[['Coupe femme','35 TND'],['Coloration','80 TND'],['Brushing','25 TND'],['Manucure','20 TND']].map(([n,p],i) => (
          <div key={i} style={{ background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.12)', borderRadius:8, padding:'9px 10px' }}>
            <div style={{ fontSize:'0.64rem', fontWeight:600, color:'#1A0A12', marginBottom:2 }}>{n}</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.8rem', fontWeight:700, color:'#EA4492' }}>{p}</div>
          </div>
        ))}
      </div>
      <button style={{ width:'100%', background:'#EA4492', color:'white', border:'none', borderRadius:7, padding:'10px', fontSize:'0.72rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5, cursor:'default', boxShadow:'0 4px 16px rgba(234,68,146,0.3)' }}>
        <ICalendar s={13}/> Réserver un rendez-vous
      </button>
    </FrameChrome>
  )
}

/* ── SLIDE 3: Booking flow ── */
function SlideBooking() {
  return (
    <FrameChrome url="yasmine.beautyglow.tn/booking">
      {/* Steps */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:16 }}>
        {[
          { label:'1', state:'done' },
          { label:'', state:'line' },
          { label:'2', state:'curr' },
          { label:'', state:'line' },
          { label:'3', state:'todo' },
        ].map((s,i) => s.state==='line'
          ? <div key={i} style={{ flex:1, height:1, background:'rgba(234,68,146,0.15)' }}/>
          : <div key={i} style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.62rem', fontWeight:700,
              background: s.state==='done' ? '#EA4492' : s.state==='curr' ? '#FFF0F8' : '#FBF5F8',
              border: s.state==='curr' ? '1.5px solid #EA4492' : s.state==='todo' ? '1px solid rgba(234,68,146,0.2)' : 'none',
              color: s.state==='done' ? 'white' : s.state==='curr' ? '#EA4492' : '#C07090',
              flexShrink: 0,
            }}>{s.state==='done' ? <ICheck s={9}/> : s.label}</div>
        )}
      </div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.9rem', fontWeight:700, color:'#1A0A12', marginBottom:12 }}>Choisissez votre créneau</div>
      {/* Service field */}
      <div style={{ background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.14)', borderRadius:7, padding:'9px 12px', marginBottom:7 }}>
        <div style={{ fontSize:'0.54rem', color:'#C07090', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:2 }}>Service choisi</div>
        <div style={{ fontSize:'0.74rem', color:'#EA4492', fontWeight:500 }}>Coupe femme — 35 TND</div>
      </div>
      {/* Date field */}
      <div style={{ background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.14)', borderRadius:7, padding:'9px 12px', marginBottom:10 }}>
        <div style={{ fontSize:'0.54rem', color:'#C07090', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:2 }}>Date</div>
        <div style={{ fontSize:'0.74rem', color:'#1A0A12', fontWeight:500 }}>Mardi 3 mars 2026</div>
      </div>
      {/* Time grid */}
      <div style={{ fontSize:'0.56rem', color:'#C07090', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:7 }}>Heure disponible</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5, marginBottom:12 }}>
        {['09:00','10:00','11:30','14:00','14:30','15:00','16:30','17:00'].map((t,i) => (
          <div key={i} style={{ background: i===3 ? '#FFF0F8' : '#FBF5F8', border: i===3 ? '1.5px solid #EA4492' : '1px solid rgba(234,68,146,0.14)', borderRadius:6, padding:'6px 4px', fontSize:'0.62rem', fontWeight:600, color: i===3 ? '#EA4492' : '#C07090', textAlign:'center', cursor:'pointer' }}>{t}</div>
        ))}
      </div>
      <button style={{ width:'100%', background:'linear-gradient(135deg,#EA4492,#F066A8)', color:'white', border:'none', borderRadius:7, padding:'10px', fontSize:'0.72rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', cursor:'default', boxShadow:'0 4px 16px rgba(234,68,146,0.3)' }}>
        Confirmer le rendez-vous
      </button>
    </FrameChrome>
  )
}

/* ── SLIDE 4: Features ── */
function SlideFeatures() {
  return (
    <FrameChrome url="beautyglow.tn/features">
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.88rem', fontWeight:700, color:'#1A0A12', marginBottom:14, fontStyle:'italic' }}>Tout ce dont vous avez besoin</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {[
          { icon:<IGlobe s={16}/>,    title:'Site pro',         desc:'En ligne en 5 min',  color:'#004E9A', bg:'rgba(66,140,212,0.1)' },
          { icon:<ICalendar s={16}/>, title:'Réservations',     desc:'24h/24, 7j/7',       color:'#EA4492', bg:'#FFF0F8' },
          { icon:<IBar s={16}/>,      title:'Analytics',        desc:'Stats détaillées',   color:'#004E9A', bg:'rgba(66,140,212,0.1)' },
          { icon:<IImage s={16}/>,    title:'Galerie photos',   desc:'Avant / Après',      color:'#EA4492', bg:'#FFF0F8' },
          { icon:<IMail s={16}/>,     title:'Notifications',    desc:'Email instantané',   color:'#004E9A', bg:'rgba(66,140,212,0.1)' },
          { icon:<IPalette s={16}/>,  title:'Thèmes exclusifs', desc:'Design luxueux',     color:'#EA4492', bg:'#FFF0F8' },
        ].map((f,i) => (
          <div key={i} style={{ background:'#FFF8FC', border:'1px solid rgba(234,68,146,0.1)', borderRadius:12, padding:'14px 12px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', color:f.color, flexShrink:0 }}>{f.icon}</div>
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#1A0A12', marginBottom:2 }}>{f.title}</div>
              <div style={{ fontSize:'0.6rem', color:'#C07090' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </FrameChrome>
  )
}

/* ── SLIDE 5: Testimonial ── */
function SlideTestimonial() {
  return (
    <FrameChrome url="beautyglow.tn/témoignages">
      <div style={{ display:'flex', gap:3, color:'#EA4492', marginBottom:14 }}>
        {[...Array(5)].map((_,i) => <IStar key={i} s={14}/>)}
      </div>
      <p style={{ fontFamily:'Playfair Display,serif', fontSize:'0.94rem', fontStyle:'italic', color:'#1A0A12', lineHeight:1.8, marginBottom:20 }}>
        &ldquo;Avant BeautyGlow, je perdais des clientes à cause des appels manqués. Maintenant elles réservent la nuit et je vois tout le matin. Mes réservations ont augmenté de 40% en un mois.&rdquo;
      </p>
      <div style={{ height:1, background:'rgba(234,68,146,0.12)', marginBottom:16 }}/>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#FF9CDA,#EA4492)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'1.1rem', fontWeight:700, color:'white', flexShrink:0 }}>Y</div>
        <div>
          <div style={{ fontSize:'0.84rem', fontWeight:700, color:'#1A0A12' }}>Yasmine B.</div>
          <div style={{ fontSize:'0.68rem', color:'#EA4492', fontWeight:500 }}>Salon Yasmine · Tunis</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        {[{num:'+40%',label:'Réservations'},{num:'14j',label:'Essai gratuit'},{num:'5min',label:'Pour démarrer'}].map((m,i) => (
          <div key={i} style={{ flex:1, background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.12)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.1rem', fontWeight:700, color:'#EA4492', lineHeight:1 }}>{m.num}</div>
            <div style={{ fontSize:'0.54rem', color:'#C07090', marginTop:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </FrameChrome>
  )
}

/* ── Slide data ── */
const SLIDES = [
  {
    tag: 'Dashboard en temps réel',
    title: <>Votre salon,<br/>piloté depuis<br/>votre <em style={{fontStyle:'italic',color:'#FF9CDA'}}>dashboard</em></>,
    desc: "Gérez vos rendez-vous, services et clientes depuis une interface claire et intuitive. Tout en un clin d'œil.",
    pills: ['Réservations live','Statistiques','Clientes'],
    visual: <SlideDashboard />,
  },
  {
    tag: 'Site web professionnel',
    title: <>Votre vitrine<br/>en ligne,<br/><em style={{fontStyle:'italic',color:'#FF9CDA'}}>élégante</em></>,
    desc: 'Un site luxueux à votre image — tarifs, galerie, réservation. Prêt en 5 minutes, sans coder.',
    pills: ['Design exclusif','Mobile-first','SEO inclus'],
    visual: <SlideSalon />,
  },
  {
    tag: 'Réservation en ligne',
    title: <>Réservations<br/>24h/24,<br/><em style={{fontStyle:'italic',color:'#FF9CDA'}}>automatiques</em></>,
    desc: 'Vos clientes choisissent leur service, leur date, leur heure — et vous recevez une notification instantanée.',
    pills: ['Zéro appel manqué','Confirmation auto','Rappels SMS'],
    visual: <SlideBooking />,
  },
  {
    tag: 'Fonctionnalités complètes',
    title: <>Tout ce qu&apos;il<br/>faut pour<br/><em style={{fontStyle:'italic',color:'#FF9CDA'}}>briller</em></>,
    desc: 'Site web, réservations, galerie, analytics, notifications — une plateforme complète pensée pour les salons.',
    pills: ['6 fonctionnalités clés','Mises à jour gratuites','Support FR'],
    visual: <SlideFeatures />,
  },
  {
    tag: 'Résultats prouvés',
    title: <>Des salons<br/>qui <em style={{fontStyle:'italic',color:'#FF9CDA'}}>brillent</em><br/>déjà</>,
    desc: "+50 salons tunisiens font confiance à BeautyGlow. Rejoignez les propriétaires qui ont transformé leur activité.",
    pills: ['+40% réservations','4.9/5 satisfaction','50+ salons'],
    visual: <SlideTestimonial />,
  },
]

const FEATURES = [
  { icon: <IGlobe />,    title: 'Site web professionnel',      desc: 'Votre adresse monsalon.beautyglow.tn — design luxueux, rapide, mobile-first. Prêt en 5 minutes.' },
  { icon: <ICalendar />, title: 'Réservation 24h/24',          desc: 'Vos clientes réservent quand elles veulent. Confirmez en un clic depuis votre dashboard.' },
  { icon: <IBar />,      title: 'Dashboard & Analytics',      desc: 'RDV, services, clientes, statistiques — tout au même endroit. Simple et intuitif.' },
  { icon: <IImage />,    title: 'Galerie & Avant/Après',       desc: 'Montrez votre travail. Les photos convertissent 3× mieux que le texte.' },
  { icon: <IMail />,     title: 'Notifications instantanées',  desc: 'Un email à chaque nouvelle réservation. Plus jamais de rendez-vous manqué.' },
  { icon: <IPalette />,  title: 'Thèmes personnalisables',     desc: 'Plusieurs designs exclusifs pour correspondre parfaitement à votre identité.' },
]

const PROBLEMS = [
  { n:'01', icon:<IPhone />,    title:'Appels manqués',           desc:'Une cliente appelle, personne ne répond. Elle réserve chez votre concurrente en 30 secondes.' },
  { n:'02', icon:<IGlobe />,    title:'Pas de présence en ligne', desc:'Instagram ne suffit plus. Les clientes cherchent un site pro avec tarifs et réservation clairs.' },
  { n:'03', icon:<ICalendar />, title:'Chaos de planning',        desc:'Papier, WhatsApp, mémoire… Les double-réservations arrivent. Le stress aussi.' },
  { n:'04', icon:<IClock />,    title:'Fermée la nuit',           desc:'Vos clientes pensent à réserver à 22h. Vous êtes indisponible. La réservation ne se fait jamais.' },
]

const STRIP_ITEMS = [
  { text:'Site web professionnel', hi:true },{ text:'Réservation en ligne', hi:false },
  { text:'14 jours gratuits', hi:true },{ text:'Aucune carte requise', hi:false },
  { text:'Configuration en 5 min', hi:true },{ text:'Support en français', hi:false },
  { text:'Thèmes exclusifs', hi:true },{ text:'Dashboard complet', hi:false },
]

const TESTIMONIALS = [
  { init:'Y', name:'Yasmine B.', salon:'Salon Yasmine, Tunis',  text:'Avant BeautyGlow, je perdais des clientes à cause des appels manqués. Maintenant elles réservent la nuit et je vois tout le matin.' },
  { init:'L', name:'Latifa M.',  salon:'Salon Latifa, Sfax',    text:'Le site est tellement professionnel. Mes clientes pensaient que j\'avais engagé un développeur ! J\'ai tout configuré moi-même.' },
  { init:'A', name:'Amira K.',   salon:'Beauty Amira, Sousse',  text:'Mes réservations ont augmenté de 40% dès le premier mois. Le système de réservation en ligne change vraiment la vie.' },
]

export default function LandingPage() {
  const router = useRouter()
  const [scrolled,   setScrolled]   = useState(false)
  const [slide,      setSlide]      = useState(0)
  const [exiting,    setExiting]    = useState<number|null>(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null)

  /* scroll-aware nav */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* auto-advance carousel */
  const goTo = useCallback((next: number) => {
    if (next === slide) return
    setExiting(slide)
    setTimeout(() => setExiting(null), 700)
    setSlide(next)
  }, [slide])

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo((slide + 1) % SLIDES.length), 5500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [slide, goTo])

  const prev = () => { if (timerRef.current) clearTimeout(timerRef.current); goTo((slide - 1 + SLIDES.length) % SLIDES.length) }
  const next = () => { if (timerRef.current) clearTimeout(timerRef.current); goTo((slide + 1) % SLIDES.length) }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#F8FAFD;color:#2D4A5E;-webkit-font-smoothing:antialiased;overflow-x:hidden;line-height:1.6}
        button{font-family:inherit;cursor:pointer}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.75)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideLeft{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .slide-enter{animation:slideUp .7s cubic-bezier(.16,1,.3,1) both}
        .slide-visual-enter{animation:slideLeft .75s cubic-bezier(.16,1,.3,1) .1s both}
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200, height:68,
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6%',
        transition:'all .4s cubic-bezier(.4,0,.2,1)',
        background: scrolled ? 'rgba(4,27,45,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(4,27,45,.3)' : 'none',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width:32, height:32, background:'#EA4492', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(234,68,146,.35)' }}><LOGO /></div>
          <span style={{ fontFamily:'Playfair Display,serif', fontSize:'1.2rem', fontWeight:700, color:'white', letterSpacing:'-.3px' }}>Beauty<span style={{color:'#FF9CDA'}}>Glow</span></span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:32 }}>
          {['Fonctionnalités','Tarifs','Témoignages'].map((l,i) => (
            <a key={i} href={['#features','#pricing','#testimonials'][i]} style={{ fontSize:'0.82rem', fontWeight:500, color:'rgba(240,248,255,.55)', textDecoration:'none', transition:'color .2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(240,248,255,.55)')}>{l}</a>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={() => router.push('/auth/login')} style={{ background:'transparent', border:'none', color:'rgba(240,248,255,.55)', padding:'9px 16px', borderRadius:7, fontSize:'0.82rem', fontWeight:500, transition:'all .2s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,.08)';(e.currentTarget as HTMLButtonElement).style.color='white'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent';(e.currentTarget as HTMLButtonElement).style.color='rgba(240,248,255,.55)'}}>
            Se connecter
          </button>
          <button onClick={() => router.push('/auth/signup')} style={{ background:'#EA4492', color:'white', border:'none', padding:'10px 22px', borderRadius:8, fontSize:'0.82rem', fontWeight:700, boxShadow:'0 4px 14px rgba(234,68,146,.35)', transition:'all .25s', display:'flex', alignItems:'center', gap:6 }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#D03A82';(e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='#EA4492';(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)'}}>
            Essai gratuit <IArrow s={13}/>
          </button>
        </div>
      </nav>

      {/* ═══ CAROUSEL HERO ═══ */}
      <section style={{ position:'relative', minHeight:'100vh', background:'linear-gradient(135deg,#041B2D 0%,#072B47 60%,#0A3D64 100%)', overflow:'hidden' }}>
        {/* Bg layers */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 80% 60% at 75% 50%,rgba(66,140,212,.12) 0%,transparent 60%),radial-gradient(ellipse 50% 80% at 10% 80%,rgba(234,68,146,.1) 0%,transparent 55%)' }}/>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(66,140,212,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(66,140,212,.05) 1px,transparent 1px)',
          backgroundSize:'56px 56px' }}/>

        {/* Slides */}
        <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>
          {SLIDES.map((s, i) => (
            <div key={i} style={{
              position:'absolute', inset:0,
              display:'grid', gridTemplateColumns:'52% 48%',
              alignItems:'center', padding:'100px 6% 80px 7%',
              opacity: i === slide ? 1 : 0,
              pointerEvents: i === slide ? 'all' : 'none',
              transition:'opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.16,1,.3,1)',
              transform: i === slide ? 'translateY(0)' : i === exiting ? 'translateY(-14px)' : 'translateY(18px)',
            }}>
              {/* LEFT */}
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', paddingRight:'5%' }}>
                {/* Tag */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(234,68,146,.12)', border:'1px solid rgba(234,68,146,.25)', borderRadius:20, padding:'6px 16px', marginBottom:28, width:'fit-content' }}>
                  <div style={{ width:6, height:6, background:'#EA4492', borderRadius:'50%', animation:'pulse 2.5s ease-in-out infinite' }}/>
                  <span style={{ fontSize:'0.68rem', fontWeight:700, color:'#FF9CDA', letterSpacing:'.5px' }}>{s.tag}</span>
                </div>
                {/* Title */}
                <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.8rem,5vw,4.4rem)', fontWeight:900, lineHeight:1.02, letterSpacing:'-2px', color:'#F0F8FF', marginBottom:20 }}>
                  {s.title}
                </h1>
                <p style={{ fontSize:'1rem', color:'rgba(240,248,255,.55)', lineHeight:1.8, fontWeight:300, maxWidth:400, marginBottom:36 }}>{s.desc}</p>
                {/* Actions */}
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:32 }}>
                  <button onClick={() => router.push('/auth/signup')} style={{ background:'#EA4492', color:'white', border:'none', padding:'13px 30px', borderRadius:8, fontSize:'0.9rem', fontWeight:700, boxShadow:'0 6px 24px rgba(234,68,146,.35)', transition:'all .25s', display:'flex', alignItems:'center', gap:8 }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#D03A82';(e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='#EA4492';(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)'}}>
                    Commencer gratuitement <IArrow/>
                  </button>
                  <button onClick={() => router.push('/auth/login')} style={{ background:'transparent', color:'rgba(240,248,255,.7)', border:'1.5px solid rgba(255,255,255,.18)', padding:'12px 26px', borderRadius:8, fontSize:'0.88rem', fontWeight:700, transition:'all .25s' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,156,218,.5)';(e.currentTarget as HTMLButtonElement).style.color='#FF9CDA'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,.18)';(e.currentTarget as HTMLButtonElement).style.color='rgba(240,248,255,.7)'}}>
                    Voir la démo
                  </button>
                </div>
                {/* Pills */}
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {s.pills.map((p, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, padding:'5px 12px', fontSize:'0.7rem', fontWeight:500, color:'rgba(240,248,255,.5)' }}>
                      <ICheck s={8}/> {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — stacked visual */}
              <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
                <div style={{ position:'relative', width:'100%', maxWidth:440 }}>
                  {/* Stack bg cards */}
                  <div style={{ position:'absolute', top:20, right:-16, width:'92%', height:'calc(100% - 40px)', background:'rgba(255,156,218,0.18)', border:'1px solid rgba(234,68,146,0.18)', borderRadius:20, transform:'rotate(3deg)' }}/>
                  <div style={{ position:'absolute', top:10, right:-8,  width:'96%', height:'calc(100% - 20px)', background:'rgba(255,220,240,0.22)', border:'1px solid rgba(234,68,146,0.12)', borderRadius:20, transform:'rotate(1.5deg)' }}/>
                  {/* Main card */}
                  <div style={{ position:'relative', zIndex:3 }}>
                    {s.visual}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ position:'absolute', bottom:40, left:'7%', display:'flex', alignItems:'center', gap:20, zIndex:10 }}>
          {/* Dots */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {SLIDES.map((_,i) => (
              <button key={i} onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); goTo(i) }}
                style={{ width: i===slide ? 28 : 6, height:6, borderRadius:3, background: i===slide ? '#EA4492' : 'rgba(255,255,255,.2)', border:'none', padding:0, cursor:'pointer', transition:'all .4s cubic-bezier(.16,1,.3,1)', boxShadow: i===slide ? '0 2px 12px rgba(234,68,146,.5)' : 'none' }}/>
            ))}
          </div>
          {/* Arrows */}
          <div style={{ display:'flex', gap:8 }}>
            {[{fn:prev,icon:<IArrowL/>},{fn:next,icon:<IArrow/>}].map((a,i) => (
              <button key={i} onClick={a.fn} style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(240,248,255,.6)', transition:'all .2s' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#EA4492';(e.currentTarget as HTMLButtonElement).style.borderColor='#EA4492';(e.currentTarget as HTMLButtonElement).style.color='white';(e.currentTarget as HTMLButtonElement).style.boxShadow='0 4px 16px rgba(234,68,146,.4)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,.06)';(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as HTMLButtonElement).style.color='rgba(240,248,255,.6)';(e.currentTarget as HTMLButtonElement).style.boxShadow='none'}}>
                {a.icon}
              </button>
            ))}
          </div>
          <span style={{ fontSize:'0.7rem', color:'rgba(240,248,255,.28)', fontWeight:500, letterSpacing:'1px' }}>
            {String(slide+1).padStart(2,'0')} / {String(SLIDES.length).padStart(2,'0')}
          </span>
        </div>

        {/* Floating notification */}
        <div style={{ position:'absolute', bottom:110, right:'6%', background:'white', borderRadius:14, padding:'11px 16px', boxShadow:'0 16px 48px rgba(4,27,45,.18)', display:'flex', alignItems:'center', gap:10, animation:'float 4s ease-in-out infinite', zIndex:10, whiteSpace:'nowrap' }}>
          <div style={{ width:34, height:34, background:'#FFF0F8', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:'#EA4492' }}><ICalendar s={15}/></div>
          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#041B2D' }}>Nouvelle réservation !</div>
            <div style={{ fontSize:'0.62rem', color:'#6B8FA8', marginTop:1 }}>Amira · Coupe · 14:00</div>
          </div>
        </div>
      </section>

      {/* ═══ STRIP ═══ */}
      <div style={{ background:'#041B2D', padding:'13px 0', overflow:'hidden', display:'flex', borderTop:'1px solid rgba(66,140,212,.1)', borderBottom:'1px solid rgba(66,140,212,.08)' }}>
        {[0,1].map(t => (
          <div key={t} aria-hidden={t===1} style={{ display:'flex', alignItems:'center', gap:44, animation:'marquee 24s linear infinite', whiteSpace:'nowrap', flexShrink:0 }}>
            {STRIP_ITEMS.map((item,j) => (
              <div key={j} style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.72rem', fontWeight:500, color: item.hi ? 'rgba(240,248,255,.78)' : 'rgba(240,248,255,.3)', letterSpacing:'.4px' }}>
                <div style={{ width:5, height:5, background:'#EA4492', transform:'rotate(45deg)', flexShrink:0 }}/>
                {item.text}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ═══ PROBLEM ═══ */}
      <section style={{ background:'#041B2D', padding:'88px 7%', position:'relative', overflow:'hidden' }}>
        {/* Ambient glows */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 50% 60% at 80% 40%,rgba(66,140,212,.07) 0%,transparent 55%),radial-gradient(ellipse 40% 50% at 10% 70%,rgba(234,68,146,.07) 0%,transparent 55%)' }}/>

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:18 }}>
              <div style={{ width:28, height:1.5, background:'#FF9CDA', borderRadius:2 }}/>
              <span style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'3.5px', textTransform:'uppercase', color:'#FF9CDA' }}>Le problème</span>
              <div style={{ width:28, height:1.5, background:'#FF9CDA', borderRadius:2 }}/>
            </div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.2rem,4vw,3.5rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.06, color:'#F0F8FF' }}>
              Vous perdez des clientes <em style={{fontStyle:'italic',color:'#FF9CDA'}}>chaque jour</em> sans le savoir
            </h2>
            <p style={{ fontSize:'0.96rem', color:'rgba(240,248,255,.38)', lineHeight:1.8, fontWeight:300, maxWidth:440, margin:'14px auto 0' }}>
              80% des salons tunisiens dépendent encore des appels manqués et des DMs Instagram.
            </p>
          </div>

          {/* 4 vertical cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[
              {
                n:'1', icon:<IPhone s={22}/>,
                title:'Appels manqués',
                desc:'Une cliente appelle, personne ne répond. Elle réserve chez votre concurrente en 30 secondes.',
                grad:'linear-gradient(160deg,#EA4492 0%,#F066A8 55%,#FF9CDA 100%)',
                blob:'rgba(255,180,220,0.22)',
              },
              {
                n:'2', icon:<IGlobe s={22}/>,
                title:'Pas de présence en ligne',
                desc:'Instagram ne suffit plus. Les clientes cherchent un site pro avec tarifs et réservation clairs.',
                grad:'linear-gradient(160deg,#7B3FBE 0%,#9B60D8 55%,#C49BF0 100%)',
                blob:'rgba(180,140,240,0.22)',
              },
              {
                n:'3', icon:<ICalendar s={22}/>,
                title:'Chaos de planning',
                desc:'Papier, WhatsApp, mémoire… Les double-réservations arrivent. Le stress aussi.',
                grad:'linear-gradient(160deg,#004E9A 0%,#1A6FC4 55%,#428CD4 100%)',
                blob:'rgba(100,180,240,0.22)',
              },
              {
                n:'4', icon:<IClock s={22}/>,
                title:'Fermée la nuit',
                desc:'Vos clientes pensent à réserver à 22h. Vous êtes indisponible. La réservation ne se fait jamais.',
                grad:'linear-gradient(160deg,#1A7A5E 0%,#26A67E 55%,#4ECDA4 100%)',
                blob:'rgba(78,205,164,0.22)',
              },
            ].map((p,i) => (
              <div key={i}
                style={{ background:'white', borderRadius:22, overflow:'hidden', boxShadow:'0 8px 32px rgba(4,27,45,.28)', transition:'transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s', cursor:'default', display:'flex', flexDirection:'column' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 20px 56px rgba(4,27,45,.38)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow='0 8px 32px rgba(4,27,45,.28)' }}>

                {/* Top — colored blob + number */}
                <div style={{ position:'relative', height:160, background:p.grad, overflow:'hidden', flexShrink:0 }}>
                  {/* Decorative blob shape */}
                  <div style={{
                    position:'absolute', bottom:-30, left:-20,
                    width:160, height:160,
                    background:p.blob,
                    borderRadius:'50%',
                  }}/>
                  {/* Number */}
                  <div style={{
                    position:'absolute', top:20, right:22,
                    fontFamily:'Playfair Display,serif',
                    fontSize:'4.5rem', fontWeight:900, lineHeight:1,
                    color:'rgba(255,255,255,0.22)',
                    letterSpacing:'-3px',
                    userSelect:'none',
                  }}>{p.n}</div>
                  {/* Icon */}
                  <div style={{
                    position:'absolute', bottom:22, left:24,
                    width:48, height:48, borderRadius:14,
                    background:'rgba(255,255,255,0.18)',
                    backdropFilter:'blur(8px)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'white',
                  }}>{p.icon}</div>
                </div>

                {/* Bottom — text content */}
                <div style={{ padding:'24px 22px 28px', flex:1, display:'flex', flexDirection:'column', gap:10, background:'white' }}>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1rem', fontWeight:700, color:'#1A0A12', lineHeight:1.3 }}>{p.title}</div>
                  <div style={{ fontSize:'0.78rem', color:'#6B7E8C', lineHeight:1.75, fontWeight:400 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding:'88px 7%', background:'#F2F6FB' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
          <div style={{ width:28, height:1.5, background:'#EA4492', borderRadius:2 }}/>
          <span style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'3.5px', textTransform:'uppercase', color:'#EA4492' }}>Comment ça marche</span>
        </div>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.2rem,4vw,3.5rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.06, color:'#041B2D', marginBottom:8 }}>
          En ligne en <em style={{fontStyle:'italic',color:'#EA4492'}}>5 minutes</em> chrono
        </h2>
        <p style={{ fontSize:'0.96rem', color:'#6B8FA8', lineHeight:1.8, maxWidth:420, marginBottom:56 }}>Pas de compétences techniques requises. Vraiment.</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>
          <div>
            {[
              { n:'1', title:'Créez votre compte',     desc:'Nom du salon, téléphone, adresse. 2 minutes chrono.' },
              { n:'2', title:'Ajoutez vos services',   desc:'Prix, durée, catégorie. Votre catalogue en ligne est prêt.' },
              { n:'3', title:'Choisissez votre thème', desc:'Un design luxueux qui correspond à votre identité.' },
              { n:'4', title:'Partagez votre lien',    desc:'monsalon.beautyglow.tn — vos clientes réservent instantanément.' },
            ].map((s,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'48px 1fr', gap:16, marginBottom: i<3 ? 28 : 0 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', border:'1.5px solid rgba(4,27,45,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'0.9rem', fontWeight:700, color:'#6B8FA8', background:'white', flexShrink:0, transition:'all .3s' }}>{s.n}</div>
                  {i < 3 && <div style={{ width:1, flex:1, minHeight:22, background:'rgba(4,27,45,.08)', margin:'7px 0' }}/>}
                </div>
                <div style={{ paddingTop:8 }}>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.98rem', fontWeight:700, color:'#041B2D', marginBottom:5 }}>{s.title}</div>
                  <div style={{ fontSize:'0.8rem', color:'#6B8FA8', lineHeight:1.75 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Browser mockup */}
          <div style={{ background:'white', borderRadius:18, overflow:'hidden', boxShadow:'0 28px 72px rgba(4,27,45,.14), 0 0 0 1px rgba(4,27,45,.07)', position:'sticky', top:90 }}>
            <div style={{ background:'#F2F6FB', padding:'11px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(4,27,45,.07)' }}>
              <div style={{ display:'flex', gap:5 }}>
                {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
              </div>
              <div style={{ flex:1, background:'white', border:'1px solid rgba(4,27,45,.07)', borderRadius:6, padding:'5px 12px', fontSize:'0.68rem', color:'#6B8FA8', textAlign:'center' }}>yasmine.beautyglow.tn</div>
            </div>
            <div style={{ padding:20 }}>
              <div style={{ height:70, background:'linear-gradient(135deg,#FFF0F8,#EBF4FF)', borderRadius:10, marginBottom:14, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(4,27,45,.07)' }}>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:'1rem', fontWeight:700, color:'#041B2D', fontStyle:'italic' }}>Salon Yasmine</span>
              </div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.88rem', fontWeight:700, color:'#041B2D', marginBottom:2 }}>Salon Yasmine</div>
              <div style={{ fontSize:'0.62rem', color:'#6B8FA8', display:'flex', alignItems:'center', gap:3, marginBottom:12 }}><IPin/>Avenue Habib Bourguiba, Tunis</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
                {[['Coupe femme','35 TND'],['Coloration','80 TND'],['Brushing','25 TND'],['Manucure','20 TND']].map(([n,p],i)=>(
                  <div key={i} style={{ background:'#F2F6FB', borderRadius:7, padding:'9px 10px', border:'1px solid rgba(4,27,45,.07)' }}>
                    <div style={{ fontSize:'0.64rem', fontWeight:600, color:'#041B2D', marginBottom:2 }}>{n}</div>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.78rem', fontWeight:700, color:'#EA4492' }}>{p}</div>
                  </div>
                ))}
              </div>
              <button style={{ width:'100%', background:'#041B2D', color:'white', border:'none', borderRadius:7, padding:'10px', fontSize:'0.72rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5, cursor:'default' }}>
                <ICalendar s={13}/> Réserver un rendez-vous
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding:'88px 7%', background:'white' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
          <div style={{ width:28, height:1.5, background:'#EA4492', borderRadius:2 }}/>
          <span style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'3.5px', textTransform:'uppercase', color:'#EA4492' }}>Fonctionnalités</span>
        </div>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.2rem,4vw,3.5rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.06, color:'#041B2D', marginBottom:56 }}>
          Tout ce dont votre salon <em style={{fontStyle:'italic',color:'#EA4492'}}>a vraiment besoin</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'start' }}>
          <div>
            {FEATURES.map((f,i) => (
              <div key={i} style={{ display:'flex', gap:16, padding:'18px 0', borderBottom:'1px solid rgba(4,27,45,.07)', cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={e => setActiveFeature(i)}>
                <div style={{ width:40, height:40, borderRadius:10, background: activeFeature===i ? '#041B2D' : '#F2F6FB', border: activeFeature===i ? 'none' : '1px solid rgba(4,27,45,.08)', display:'flex', alignItems:'center', justifyContent:'center', color: activeFeature===i ? 'white' : '#6B8FA8', flexShrink:0, transition:'all .3s cubic-bezier(.16,1,.3,1)', boxShadow: activeFeature===i ? '0 6px 20px rgba(4,27,45,.2)' : 'none' }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.96rem', fontWeight:700, color: activeFeature===i ? '#EA4492' : '#041B2D', marginBottom:4, transition:'color .2s' }}>{f.title}</div>
                  <div style={{ fontSize:'0.78rem', color:'#6B8FA8', lineHeight:1.7, maxHeight: activeFeature===i ? 72 : 0, overflow:'hidden', opacity: activeFeature===i ? 1 : 0, transition:'max-height .35s cubic-bezier(.16,1,.3,1), opacity .25s' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:'#041B2D', borderRadius:20, padding:'44px 36px', border:'1px solid rgba(66,140,212,.15)', textAlign:'center', minHeight:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, position:'sticky', top:90, transition:'all .4s' }}>
            <div style={{ width:72, height:72, background:'#EA4492', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', color:'white', boxShadow:'0 8px 28px rgba(234,68,146,.4)' }}>
              <div style={{ transform:'scale(1.8)' }}>{FEATURES[activeFeature].icon}</div>
            </div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.3rem', fontWeight:700, color:'#F0F8FF' }}>{FEATURES[activeFeature].title}</div>
            <div style={{ fontSize:'0.84rem', color:'rgba(240,248,255,.45)', lineHeight:1.75, maxWidth:260 }}>{FEATURES[activeFeature].desc}</div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ padding:'88px 7%', background:'#F2F6FB' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:18 }}>
            <div style={{ width:28, height:1.5, background:'#EA4492', borderRadius:2 }}/>
            <span style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'3.5px', textTransform:'uppercase', color:'#EA4492' }}>Tarifs simples</span>
            <div style={{ width:28, height:1.5, background:'#EA4492', borderRadius:2 }}/>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.2rem,4vw,3.5rem)', fontWeight:900, letterSpacing:'-1.8px', color:'#041B2D' }}>
            Un rendez-vous suffit à <em style={{fontStyle:'italic',color:'#EA4492'}}>rentabiliser</em>
          </h2>
          <p style={{ fontSize:'0.96rem', color:'#6B8FA8', lineHeight:1.8, maxWidth:400, margin:'12px auto 0' }}>Pas d&apos;engagement. Annulez quand vous voulez.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:720, margin:'0 auto' }}>
          {[
            { tier:'Basic', price:'89', featured:false, feats:['Site web professionnel','Réservation en ligne','Dashboard complet','Galerie photos','Notifications email','Support standard'] },
            { tier:'Pro',   price:'149', featured:true,  feats:['Tout le plan Basic','Domaine personnalisé','Campagnes email','Statistiques avancées','Support prioritaire','Multi-staff (bientôt)'] },
          ].map((plan,i) => (
            <div key={i} style={{ border: plan.featured ? 'none' : '1px solid rgba(4,27,45,.08)', borderRadius:20, padding:'38px 30px', background: plan.featured ? '#041B2D' : 'white', position:'relative', overflow:'hidden', transition:'all .3s', boxShadow: plan.featured ? '0 28px 72px rgba(4,27,45,.22)' : 'none' }}
              onMouseEnter={e => { if (!plan.featured) (e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)';  (e.currentTarget as HTMLDivElement).style.boxShadow= plan.featured ? '0 32px 80px rgba(4,27,45,.28)' : '0 16px 48px rgba(4,27,45,.14)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform='translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow= plan.featured ? '0 28px 72px rgba(4,27,45,.22)' : 'none' }}>
              {plan.featured && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#EA4492,#FF9CDA)' }}/>}
              {plan.featured && <div style={{ position:'absolute', top:16, right:16, background:'rgba(234,68,146,.15)', border:'1px solid rgba(234,68,146,.25)', color:'#FF9CDA', fontSize:'0.58rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', padding:'3px 9px', borderRadius:20 }}>Populaire</div>}
              <span style={{ fontSize:'0.58rem', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color: plan.featured ? '#428CD4' : '#6B8FA8', marginBottom:18, display:'block' }}>{plan.tier}</span>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:3 }}>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:'3.8rem', fontWeight:900, color: plan.featured ? 'white' : '#041B2D', lineHeight:1, letterSpacing:'-3px' }}>{plan.price}</span>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:'1.2rem', fontWeight:700, color: plan.featured ? 'rgba(240,248,255,.35)' : '#6B8FA8', marginBottom:6 }}>TND</span>
              </div>
              <div style={{ fontSize:'0.72rem', color: plan.featured ? 'rgba(240,248,255,.35)' : '#6B8FA8', marginBottom:22 }}>par mois · 14 jours gratuits</div>
              <div style={{ height:1, background: plan.featured ? 'rgba(255,255,255,.07)' : 'rgba(4,27,45,.07)', marginBottom:18 }}/>
              <ul style={{ listStyle:'none', marginBottom:28, display:'flex', flexDirection:'column', gap:10 }}>
                {plan.feats.map((f,j) => (
                  <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:9, fontSize:'0.8rem', color: plan.featured ? 'rgba(240,248,255,.55)' : '#6B8FA8' }}>
                    <div style={{ width:17, height:17, borderRadius:'50%', background: plan.featured ? 'rgba(234,68,146,.1)' : '#FFF0F8', border: plan.featured ? '1px solid rgba(234,68,146,.22)' : '1px solid #FFD6EE', display:'flex', alignItems:'center', justifyContent:'center', color: plan.featured ? '#FF9CDA' : '#EA4492', flexShrink:0, marginTop:1 }}><ICheck s={8}/></div>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/auth/signup')} style={{ width:'100%', background: plan.featured ? '#EA4492' : 'white', color: plan.featured ? 'white' : '#041B2D', border: plan.featured ? 'none' : '1.5px solid rgba(4,27,45,.14)', borderRadius:8, padding:'12px', fontSize:'0.84rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:7, transition:'all .25s', boxShadow: plan.featured ? '0 6px 20px rgba(234,68,146,.35)' : 'none' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)';(e.currentTarget as HTMLButtonElement).style.background= plan.featured ? '#D03A82' : '#041B2D';if(!plan.featured)(e.currentTarget as HTMLButtonElement).style.color='white'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)';(e.currentTarget as HTMLButtonElement).style.background= plan.featured ? '#EA4492' : 'white';if(!plan.featured)(e.currentTarget as HTMLButtonElement).style.color='#041B2D'}}>
                Commencer gratuitement <IArrow s={13}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" style={{ padding:'88px 7%', background:'white' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
          <div style={{ width:28, height:1.5, background:'#EA4492', borderRadius:2 }}/>
          <span style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'3.5px', textTransform:'uppercase', color:'#EA4492' }}>Témoignages</span>
        </div>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.2rem,4vw,3.5rem)', fontWeight:900, letterSpacing:'-1.8px', color:'#041B2D', marginBottom:52 }}>
          Elles nous font <em style={{fontStyle:'italic',color:'#EA4492'}}>confiance</em>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
          {TESTIMONIALS.map((t,i) => (
            <div key={i} style={{ background:'white', border:'1px solid rgba(4,27,45,.07)', borderRadius:18, padding:'26px 22px', transition:'all .3s', position:'relative', overflow:'hidden' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='#FFD6EE';(e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 16px 48px rgba(4,27,45,.1)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor='rgba(4,27,45,.07)';(e.currentTarget as HTMLDivElement).style.transform='translateY(0)';(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,#EA4492,transparent)', opacity:0, transition:'opacity .3s' }}/>
              <span style={{ fontFamily:'Playfair Display,serif', fontSize:'3.2rem', fontWeight:900, color:'#FFD6EE', lineHeight:.8, marginBottom:10, display:'block' }}>&ldquo;</span>
              <div style={{ display:'flex', gap:3, color:'#EA4492', marginBottom:10 }}>
                {[...Array(5)].map((_,j) => <IStar key={j}/>)}
              </div>
              <p style={{ fontFamily:'Playfair Display,serif', fontSize:'0.87rem', fontStyle:'italic', color:'#041B2D', lineHeight:1.8, marginBottom:18 }}>{t.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:16, borderTop:'1px solid rgba(4,27,45,.07)' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#FF9CDA,#EA4492)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'0.88rem', fontWeight:700, color:'white', flexShrink:0 }}>{t.init}</div>
                <div>
                  <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#041B2D' }}>{t.name}</div>
                  <div style={{ fontSize:'0.66rem', color:'#EA4492', fontWeight:500 }}>{t.salon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ background:'#041B2D', padding:'88px 7%', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none',
          background:'radial-gradient(ellipse 70% 90% at 5% 50%,rgba(234,68,146,.1) 0%,transparent 55%),radial-gradient(ellipse 50% 70% at 90% 30%,rgba(66,140,212,.1) 0%,transparent 55%)' }}/>
        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:60 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <div style={{ width:28, height:1.5, background:'#FF9CDA', borderRadius:2 }}/>
              <span style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'3.5px', textTransform:'uppercase', color:'#FF9CDA' }}>Prête à briller ?</span>
            </div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.2rem,4.5vw,3.8rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.04, color:'#F0F8FF', marginBottom:14 }}>
              Lancez votre salon<br/>en ligne <em style={{fontStyle:'italic',color:'#FF9CDA'}}>aujourd&apos;hui</em>
            </h2>
            <p style={{ fontSize:'0.92rem', color:'rgba(240,248,255,.4)', fontWeight:300, lineHeight:1.7 }}>14 jours gratuits. Aucune carte bancaire. Configuration en 5 minutes.</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, flexShrink:0 }}>
            <button onClick={() => router.push('/auth/signup')} style={{ background:'white', color:'#041B2D', border:'none', padding:'16px 38px', borderRadius:9, fontSize:'0.94rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', gap:8, whiteSpace:'nowrap', boxShadow:'0 6px 24px rgba(0,0,0,.2)', transition:'all .3s' }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#EA4492';(e.currentTarget as HTMLButtonElement).style.color='white';(e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 32px rgba(234,68,146,.4)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='white';(e.currentTarget as HTMLButtonElement).style.color='#041B2D';(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)';(e.currentTarget as HTMLButtonElement).style.boxShadow='0 6px 24px rgba(0,0,0,.2)'}}>
              Créer mon site gratuitement <IArrow/>
            </button>
            <span style={{ fontSize:'0.66rem', color:'rgba(240,248,255,.22)', display:'flex', alignItems:'center', gap:5 }}>
              <IZap/> Aucun engagement — Annulez quand vous voulez
            </span>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background:'#020E18', padding:'42px 7%', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, borderTop:'1px solid rgba(255,255,255,.03)' }}>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.1rem', fontWeight:700, color:'#F0F8FF' }}>Beauty<span style={{color:'#FF9CDA'}}>Glow</span>.tn</div>
        <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
          {['Accueil','Tarifs','Contact','Confidentialité'].map((l,i) => (
            <a key={i} href="#" style={{ fontSize:'0.74rem', color:'rgba(255,255,255,.22)', textDecoration:'none', fontWeight:400, transition:'color .2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='#FF9CDA')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.22)')}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,.1)' }}>© 2026 BeautyGlow. Tous droits réservés.</div>
      </footer>
    </>
  )
}