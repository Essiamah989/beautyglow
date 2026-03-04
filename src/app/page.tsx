'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* ── SVG Icons ── */
const ICalendar = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IGlobe   = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IBar     = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const IImage   = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const IMail    = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IPalette = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const IPhone   = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const IClock   = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IArrow   = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IArrowL  = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const ICheck   = ({s=10}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IStar    = ({s=13}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const ITrend   = ({s=16}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IZap     = ({s=12}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IPin     = ({s=11}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>

const LOGO = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
)

/* ══════════════════════════════════════════
   SHARED TOKENS
══════════════════════════════════════════ */
const C = {
  navy0:  '#020E18',  // darkest footer
  navy1:  '#041B2D',  // hero / cta bg
  navy2:  '#072B47',  // slightly lighter sections
  navy3:  '#0A3A5C',  // lightest dark section
  pink:   '#EA4492',
  pinkM:  '#F066A8',
  pinkS:  '#FF9CDA',
  pinkP:  '#FFF0F8',
  pinkB:  'rgba(234,68,146,0.12)',
  white:  '#FFFFFF',
  ink:    '#1A0A12',
  muted:  '#C07090',
  text:   '#2D1020',
  onDark: '#F0F8FF',
  faded:  'rgba(240,248,255,0.42)',
}

/* Eyebrow label shared between sections */
function Eyebrow({ label, light=false, center=false }: { label:string; light?:boolean; center?:boolean }) {
  const color = light ? C.pinkS : C.pink
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent: center ? 'center' : 'flex-start', gap:12, marginBottom:16 }}>
      <div style={{ width:24, height:1.5, background:color, borderRadius:2, flexShrink:0 }}/>
      <span style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'3.5px', textTransform:'uppercase', color }}>{label}</span>
      {center && <div style={{ width:24, height:1.5, background:color, borderRadius:2, flexShrink:0 }}/>}
    </div>
  )
}

/* ══════════════════════════════════════════
   CAROUSEL FRAME — white / pinkish
══════════════════════════════════════════ */
function FrameChrome({ url, children }: { url:string; children:React.ReactNode }) {
  return (
    <div style={{ background:'#FFFFFF', border:'1px solid rgba(234,68,146,0.14)', borderRadius:20, overflow:'hidden', boxShadow:'0 28px 72px rgba(4,27,45,0.28)' }}>
      <div style={{ background:'#FFF5FA', borderBottom:'1px solid rgba(234,68,146,0.1)', padding:'11px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', gap:5 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
        </div>
        <div style={{ flex:1, background:'rgba(234,68,146,0.07)', borderRadius:5, padding:'3px 10px', fontSize:'0.62rem', color:'rgba(150,60,100,0.45)', textAlign:'center' }}>{url}</div>
        <div style={{ width:48 }}/>
      </div>
      <div style={{ padding:18, background:'#FFFBFD' }}>{children}</div>
    </div>
  )
}

/* ── Slide visuals ── */
function SlideDashboard() {
  return (
    <FrameChrome url="dashboard.beautyglow.tn">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, color:C.ink, fontSize:'0.92rem' }}>Bonjour, Yasmine ✦</div>
          <div style={{ fontSize:'0.58rem', color:C.muted, marginTop:2 }}>Lundi 2 mars 2026</div>
        </div>
        <div style={{ background:C.pinkP, border:'1px solid rgba(234,68,146,0.25)', borderRadius:20, padding:'3px 10px', fontSize:'0.58rem', fontWeight:700, color:C.pink, display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:C.pink, animation:'pulse 2s infinite' }}/> En ligne
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7, marginBottom:12 }}>
        {[{ icon:<ICalendar s={12}/>, num:'8', label:"Aujourd'hui" }, { icon:<ITrend s={12}/>, num:'94%', label:'Confirmés' }, { icon:<IStar s={12}/>, num:'4.9', label:'Avis' }].map((s,i) => (
          <div key={i} style={{ background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.1)', borderRadius:9, padding:'10px 8px' }}>
            <div style={{ width:24, height:24, background:C.pinkB, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:C.pink, marginBottom:7 }}>{s.icon}</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.1rem', fontWeight:700, color:C.ink, lineHeight:1, marginBottom:2 }}>{s.num}</div>
            <div style={{ fontSize:'0.53rem', color:C.muted, textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:'0.55rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', color:C.muted, marginBottom:7 }}>Rendez-vous du jour</div>
      {[{ cls:['#EA4492','#F066A8'], init:'A', name:'Amira B.', svc:'Coupe femme', time:'14:00' }, { cls:['#004E9A','#428CD4'], init:'S', name:'Sonia M.', svc:'Coloration', time:'15:30' }, { cls:['#7B68EE','#9B88FF'], init:'L', name:'Leila K.', svc:'Manucure', time:'17:00' }].map((b,i) => (
        <div key={i} style={{ background:'#FFF8FC', border:'1px solid rgba(234,68,146,0.08)', borderRadius:7, padding:'8px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:i<2?5:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:`linear-gradient(135deg,${b.cls[0]},${b.cls[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'0.58rem', fontWeight:700, color:'white', flexShrink:0 }}>{b.init}</div>
            <div><div style={{ fontSize:'0.66rem', fontWeight:600, color:C.ink }}>{b.name}</div><div style={{ fontSize:'0.55rem', color:C.muted }}>{b.svc}</div></div>
          </div>
          <div style={{ fontSize:'0.58rem', fontWeight:700, color:C.pink, background:C.pinkP, border:'1px solid rgba(234,68,146,0.2)', padding:'2px 7px', borderRadius:20 }}>{b.time}</div>
        </div>
      ))}
    </FrameChrome>
  )
}

function SlideSalon() {
  return (
    <FrameChrome url="yasmine.beautyglow.tn">
      <div style={{ height:62, background:'linear-gradient(135deg,#FFF0F8,#F0F4FF)', borderRadius:9, marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(234,68,146,0.1)' }}>
        <span style={{ fontFamily:'Playfair Display,serif', fontSize:'1rem', fontWeight:700, color:C.ink, fontStyle:'italic' }}>Salon Yasmine</span>
      </div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.84rem', fontWeight:700, color:C.ink, marginBottom:2 }}>Salon Yasmine</div>
      <div style={{ fontSize:'0.58rem', color:C.muted, display:'flex', alignItems:'center', gap:3, marginBottom:10 }}><IPin s={10}/>Avenue Habib Bourguiba, Tunis</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5, marginBottom:10 }}>
        {[['Coupe femme','35 TND'],['Coloration','80 TND'],['Brushing','25 TND'],['Manucure','20 TND']].map(([n,p],i) => (
          <div key={i} style={{ background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.1)', borderRadius:7, padding:'8px 9px' }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, color:C.ink, marginBottom:2 }}>{n}</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.76rem', fontWeight:700, color:C.pink }}>{p}</div>
          </div>
        ))}
      </div>
      <button style={{ width:'100%', background:C.pink, color:'white', border:'none', borderRadius:7, padding:'9px', fontSize:'0.68rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:4, cursor:'default', boxShadow:'0 4px 14px rgba(234,68,146,0.28)' }}>
        <ICalendar s={12}/> Réserver un rendez-vous
      </button>
    </FrameChrome>
  )
}

function SlideBooking() {
  return (
    <FrameChrome url="yasmine.beautyglow.tn/booking">
      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:14 }}>
        {[{ s:'done' },{ s:'line' },{ s:'curr' },{ s:'line' },{ s:'todo' }].map((x,i) =>
          x.s==='line'
            ? <div key={i} style={{ flex:1, height:1, background:'rgba(234,68,146,0.15)' }}/>
            : <div key={i} style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.58rem', fontWeight:700, flexShrink:0,
                background: x.s==='done' ? C.pink : x.s==='curr' ? C.pinkP : '#FBF5F8',
                border: x.s==='curr' ? `1.5px solid ${C.pink}` : x.s==='todo' ? '1px solid rgba(234,68,146,0.18)' : 'none',
                color: x.s==='done' ? 'white' : x.s==='curr' ? C.pink : C.muted,
              }}>{x.s==='done' ? <ICheck s={8}/> : x.s==='curr' ? '2' : '3'}</div>
        )}
      </div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.86rem', fontWeight:700, color:C.ink, marginBottom:10 }}>Choisissez votre créneau</div>
      {[{ label:'Service', val:'Coupe femme — 35 TND', pink:true }, { label:'Date', val:'Mardi 3 mars 2026', pink:false }].map((f,i) => (
        <div key={i} style={{ background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.12)', borderRadius:6, padding:'8px 10px', marginBottom:6 }}>
          <div style={{ fontSize:'0.52rem', color:C.muted, fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:2 }}>{f.label}</div>
          <div style={{ fontSize:'0.7rem', color: f.pink ? C.pink : C.ink, fontWeight:500 }}>{f.val}</div>
        </div>
      ))}
      <div style={{ fontSize:'0.52rem', color:C.muted, fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', marginBottom:6 }}>Heure disponible</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4, marginBottom:10 }}>
        {['09:00','10:00','11:30','14:00','14:30','15:00','16:30','17:00'].map((t,i) => (
          <div key={i} style={{ background: i===3?C.pinkP:'#FBF5F8', border: i===3?`1.5px solid ${C.pink}`:'1px solid rgba(234,68,146,0.12)', borderRadius:5, padding:'5px 3px', fontSize:'0.58rem', fontWeight:600, color: i===3?C.pink:C.muted, textAlign:'center' }}>{t}</div>
        ))}
      </div>
      <button style={{ width:'100%', background:`linear-gradient(135deg,${C.pink},${C.pinkM})`, color:'white', border:'none', borderRadius:7, padding:'9px', fontSize:'0.68rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', cursor:'default', boxShadow:'0 4px 14px rgba(234,68,146,0.28)' }}>Confirmer le rendez-vous</button>
    </FrameChrome>
  )
}

function SlideFeatures() {
  return (
    <FrameChrome url="beautyglow.tn/features">
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.84rem', fontWeight:700, color:C.ink, marginBottom:12, fontStyle:'italic' }}>Tout ce dont vous avez besoin</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
        {[
          { icon:<IGlobe s={15}/>,    title:'Site pro',         desc:'En ligne en 5 min',  col:'#004E9A', bg:'rgba(66,140,212,0.1)' },
          { icon:<ICalendar s={15}/>, title:'Réservations',     desc:'24h/24, 7j/7',       col:C.pink,    bg:C.pinkP },
          { icon:<IBar s={15}/>,      title:'Analytics',        desc:'Stats détaillées',   col:'#004E9A', bg:'rgba(66,140,212,0.1)' },
          { icon:<IImage s={15}/>,    title:'Galerie photos',   desc:'Avant / Après',      col:C.pink,    bg:C.pinkP },
          { icon:<IMail s={15}/>,     title:'Notifications',    desc:'Email instantané',   col:'#004E9A', bg:'rgba(66,140,212,0.1)' },
          { icon:<IPalette s={15}/>,  title:'Thèmes exclusifs', desc:'Design luxueux',     col:C.pink,    bg:C.pinkP },
        ].map((f,i) => (
          <div key={i} style={{ background:'#FFF8FC', border:'1px solid rgba(234,68,146,0.09)', borderRadius:10, padding:'12px 10px', display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', color:f.col, flexShrink:0 }}>{f.icon}</div>
            <div>
              <div style={{ fontSize:'0.66rem', fontWeight:700, color:C.ink, marginBottom:1 }}>{f.title}</div>
              <div style={{ fontSize:'0.56rem', color:C.muted }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </FrameChrome>
  )
}

function SlideTestimonial() {
  return (
    <FrameChrome url="beautyglow.tn/témoignages">
      <div style={{ display:'flex', gap:3, color:C.pink, marginBottom:12 }}>{[...Array(5)].map((_,i) => <IStar key={i} s={13}/>)}</div>
      <p style={{ fontFamily:'Playfair Display,serif', fontSize:'0.9rem', fontStyle:'italic', color:C.ink, lineHeight:1.8, marginBottom:18 }}>
        &ldquo;Avant BeautyGlow, je perdais des clientes à cause des appels manqués. Maintenant elles réservent la nuit et je vois tout le matin. Mes réservations ont augmenté de 40% en un mois.&rdquo;
      </p>
      <div style={{ height:1, background:'rgba(234,68,146,0.1)', marginBottom:14 }}/>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${C.pinkS},${C.pink})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'1rem', fontWeight:700, color:'white', flexShrink:0 }}>Y</div>
        <div>
          <div style={{ fontSize:'0.8rem', fontWeight:700, color:C.ink }}>Yasmine B.</div>
          <div style={{ fontSize:'0.64rem', color:C.pink, fontWeight:500 }}>Salon Yasmine · Tunis</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:7 }}>
        {[{num:'+40%',label:'Réservations'},{num:'14j',label:'Essai gratuit'},{num:'5min',label:'Pour démarrer'}].map((m,i) => (
          <div key={i} style={{ flex:1, background:'#FFF5FA', border:'1px solid rgba(234,68,146,0.1)', borderRadius:9, padding:'10px 6px', textAlign:'center' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.05rem', fontWeight:700, color:C.pink, lineHeight:1 }}>{m.num}</div>
            <div style={{ fontSize:'0.5rem', color:C.muted, marginTop:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </FrameChrome>
  )
}

/* ── Carousel slides data ── */
const SLIDES = [
  { tag:'Dashboard en temps réel', title:<>Votre salon,<br/>piloté depuis<br/>votre <em style={{fontStyle:'italic',color:C.pinkS}}>dashboard</em></>, desc:"Gérez vos rendez-vous, services et clientes depuis une interface claire et intuitive.", pills:['Réservations live','Statistiques','Clientes'], visual:<SlideDashboard/> },
  { tag:'Site web professionnel',  title:<>Votre vitrine<br/>en ligne,<br/><em style={{fontStyle:'italic',color:C.pinkS}}>élégante</em></>, desc:'Un site luxueux à votre image — tarifs, galerie, réservation. Prêt en 5 minutes.', pills:['Design exclusif','Mobile-first','SEO inclus'], visual:<SlideSalon/> },
  { tag:'Réservation en ligne',    title:<>Réservations<br/>24h/24,<br/><em style={{fontStyle:'italic',color:C.pinkS}}>automatiques</em></>, desc:'Vos clientes choisissent leur service, date et heure. Vous recevez une notification instantanée.', pills:['Zéro appel manqué','Confirmation auto','Rappels SMS'], visual:<SlideBooking/> },
  { tag:'Fonctionnalités complètes', title:<>Tout ce qu&apos;il<br/>faut pour<br/><em style={{fontStyle:'italic',color:C.pinkS}}>briller</em></>, desc:'Site web, réservations, galerie, analytics — une plateforme complète pour votre salon.', pills:['6 fonctionnalités','Mises à jour gratuites','Support FR'], visual:<SlideFeatures/> },
  { tag:'Résultats prouvés',       title:<>Des salons<br/>qui <em style={{fontStyle:'italic',color:C.pinkS}}>brillent</em><br/>déjà</>, desc:'+50 salons tunisiens font confiance à BeautyGlow. Rejoignez les propriétaires qui ont transformé leur activité.', pills:['+40% réservations','4.9/5 satisfaction','50+ salons'], visual:<SlideTestimonial/> },
]

const FEATURES = [
  { icon:<IGlobe/>,    title:'Site web professionnel',     desc:'Votre adresse monsalon.beautyglow.tn — design luxueux, rapide, mobile-first. Prêt en 5 minutes.' },
  { icon:<ICalendar/>, title:'Réservation 24h/24',         desc:'Vos clientes réservent quand elles veulent. Confirmez en un clic depuis votre dashboard.' },
  { icon:<IBar/>,      title:'Dashboard & Analytics',      desc:'RDV, services, clientes, statistiques — tout au même endroit. Simple et intuitif.' },
  { icon:<IImage/>,    title:'Galerie & Avant/Après',      desc:'Montrez votre travail. Les photos convertissent 3× mieux que le texte.' },
  { icon:<IMail/>,     title:'Notifications instantanées', desc:'Un email à chaque nouvelle réservation. Plus jamais de rendez-vous manqué.' },
  { icon:<IPalette/>,  title:'Thèmes personnalisables',    desc:'Plusieurs designs exclusifs pour correspondre parfaitement à votre identité.' },
]

const TESTIMONIALS = [
  { init:'Y', name:'Yasmine B.', salon:'Salon Yasmine, Tunis',  text:'Avant BeautyGlow, je perdais des clientes à cause des appels manqués. Maintenant elles réservent la nuit et je vois tout le matin.' },
  { init:'L', name:'Latifa M.',  salon:'Salon Latifa, Sfax',    text:"Le site est tellement professionnel. Mes clientes pensaient que j'avais engagé un développeur ! J'ai tout configuré moi-même." },
  { init:'A', name:'Amira K.',   salon:'Beauty Amira, Sousse',  text:'Mes réservations ont augmenté de 40% dès le premier mois. Le système de réservation en ligne change vraiment la vie.' },
]

const STRIP = [
  { t:'Site web professionnel', hi:true }, { t:'Réservation en ligne', hi:false },
  { t:'14 jours gratuits', hi:true },      { t:'Aucune carte requise', hi:false },
  { t:'Configuration en 5 min', hi:true }, { t:'Support en français', hi:false },
  { t:'Thèmes exclusifs', hi:true },       { t:'Dashboard complet', hi:false },
]

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function LandingPage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [slide,    setSlide]    = useState(0)
  const [exiting,  setExiting]  = useState<number|null>(null)
  const [activeFeat, setActiveFeat] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const goTo = useCallback((next:number) => {
    if (next === slide) return
    setExiting(slide)
    setTimeout(() => setExiting(null), 700)
    setSlide(next)
  }, [slide])

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo((slide+1) % SLIDES.length), 5500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [slide, goTo])

  const prev = () => { if (timerRef.current) clearTimeout(timerRef.current); goTo((slide-1+SLIDES.length)%SLIDES.length) }
  const next = () => { if (timerRef.current) clearTimeout(timerRef.current); goTo((slide+1)%SLIDES.length) }

  /* ── Shared button hover helpers ── */
  const hoverPink  = (e:React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background=C.pink; e.currentTarget.style.color='white'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(234,68,146,.38)' }
  const unhoverPink= (e:React.MouseEvent<HTMLButtonElement>, bg='white', col='#041B2D') => { e.currentTarget.style.background=bg; e.currentTarget.style.color=col; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(0,0,0,.18)' }

  return (
    <>
      {/* ── Global styles + responsive ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { font-family:'Plus Jakarta Sans',sans-serif; background:${C.navy1}; color:${C.onDark}; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        button { font-family:inherit; cursor:pointer; border:none; }
        a { text-decoration:none; }

        /* animations */
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.75)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ── Responsive breakpoints ── */

        /* Carousel */
        .carousel-grid { display:grid; grid-template-columns:52% 48%; align-items:center; padding:100px 6% 80px 7%; min-height:100vh; }
        @media(max-width:1100px){ .carousel-grid { grid-template-columns:1fr; padding:90px 5% 70px; min-height:auto; } .carousel-right { display:none!important; } }
        @media(max-width:680px){ .carousel-grid { padding:80px 5% 60px; } }

        /* Problem cards */
        .problem-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
        @media(max-width:1000px){ .problem-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:580px){ .problem-grid { grid-template-columns:1fr; } }

        /* How-it-works */
        .how-grid { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:start; }
        @media(max-width:900px){ .how-grid { grid-template-columns:1fr; gap:40px; } .how-browser { display:none!important; } }

        /* Features */
        .features-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start; }
        @media(max-width:900px){ .features-grid { grid-template-columns:1fr; } .feat-visual { display:none!important; } }

        /* Pricing */
        .pricing-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:720px; margin:48px auto 0; }
        @media(max-width:700px){ .pricing-grid { grid-template-columns:1fr; max-width:420px; } }

        /* Testimonials */
        .testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:48px; }
        @media(max-width:900px){ .testi-grid { grid-template-columns:1fr 1fr; } }
        @media(max-width:580px){ .testi-grid { grid-template-columns:1fr; } }

        /* CTA */
        .cta-grid { display:grid; grid-template-columns:1fr auto; align-items:center; gap:48px; }
        @media(max-width:700px){ .cta-grid { grid-template-columns:1fr; } }

        /* Nav links hidden on mobile */
        .nav-links { display:flex; align-items:center; gap:28px; }
        @media(max-width:700px){ .nav-links { display:none; } }

        /* Footer */
        .footer-inner { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; }
        @media(max-width:600px){ .footer-inner { flex-direction:column; text-align:center; } .footer-links { justify-content:center; } }

        /* Strip */
        .strip-track { display:flex; align-items:center; gap:40px; animation:marquee 24s linear infinite; white-space:nowrap; flex-shrink:0; }
      `}</style>

      {/* ═══════════════════════════════════
          NAV
      ═══════════════════════════════════ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200, height:66,
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6%',
        transition:'all .4s cubic-bezier(.4,0,.2,1)',
        background: scrolled ? 'rgba(4,27,45,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        boxShadow: scrolled ? '0 4px 24px rgba(4,27,45,.4)' : 'none',
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => router.push('/')}>
          <div style={{ width:30, height:30, background:C.pink, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(234,68,146,.35)' }}><LOGO/></div>
          <span style={{ fontFamily:'Playfair Display,serif', fontSize:'1.15rem', fontWeight:700, color:'white' }}>Beauty<span style={{color:C.pinkS}}>Glow</span></span>
        </div>

        {/* Links */}
        <div className="nav-links">
          {['Fonctionnalités','Tarifs','Témoignages'].map((l,i) => (
            <a key={i} href={['#features','#pricing','#testimonials'][i]}
              style={{ fontSize:'0.8rem', fontWeight:500, color:'rgba(240,248,255,.5)', transition:'color .2s' }}
              onMouseEnter={e=>(e.currentTarget.style.color='white')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(240,248,255,.5)')}>{l}</a>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={() => router.push('/auth/login')}
            style={{ background:'transparent', color:'rgba(240,248,255,.5)', padding:'8px 14px', borderRadius:7, fontSize:'0.8rem', fontWeight:500, transition:'all .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.color='white'}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(240,248,255,.5)'}}>
            Se connecter
          </button>
          <button onClick={() => router.push('/auth/signup')}
            style={{ background:C.pink, color:'white', padding:'9px 20px', borderRadius:8, fontSize:'0.8rem', fontWeight:700, boxShadow:'0 4px 14px rgba(234,68,146,.35)', transition:'all .25s', display:'flex', alignItems:'center', gap:5 }}
            onMouseEnter={e=>{e.currentTarget.style.background='#D03A82';e.currentTarget.style.transform='translateY(-1px)'}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.pink;e.currentTarget.style.transform='translateY(0)'}}>
            Essai gratuit <IArrow s={12}/>
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════
          HERO CAROUSEL
      ═══════════════════════════════════ */}
      <section style={{ position:'relative', minHeight:'100vh', background:`linear-gradient(135deg,${C.navy1} 0%,${C.navy2} 60%,${C.navy3} 100%)`, overflow:'hidden' }}>
        {/* Bg glows */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 80% 60% at 75% 50%,rgba(66,140,212,.1) 0%,transparent 60%),radial-gradient(ellipse 50% 70% at 10% 80%,rgba(234,68,146,.09) 0%,transparent 55%)' }}/>
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(66,140,212,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(66,140,212,.04) 1px,transparent 1px)', backgroundSize:'56px 56px' }}/>

        {/* Slides */}
        <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>
          {SLIDES.map((s,i) => (
            <div key={i} className="carousel-grid" style={{
              position:'absolute', inset:0,
              opacity: i===slide ? 1 : 0,
              pointerEvents: i===slide ? 'all' : 'none',
              transition:'opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.16,1,.3,1)',
              transform: i===slide ? 'translateY(0)' : i===exiting ? 'translateY(-14px)' : 'translateY(18px)',
            }}>
              {/* Left text */}
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', paddingRight:'4%' }}>
                {/* Tag */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(234,68,146,.12)', border:'1px solid rgba(234,68,146,.25)', borderRadius:20, padding:'5px 14px', marginBottom:24, width:'fit-content' }}>
                  <div style={{ width:5, height:5, background:C.pink, borderRadius:'50%', animation:'pulse 2.5s ease-in-out infinite' }}/>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, color:C.pinkS, letterSpacing:'.5px' }}>{s.tag}</span>
                </div>
                {/* Title */}
                <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.4rem,4.5vw,4.2rem)', fontWeight:900, lineHeight:1.02, letterSpacing:'-2px', color:C.onDark, marginBottom:18 }}>{s.title}</h1>
                <p style={{ fontSize:'0.95rem', color:C.faded, lineHeight:1.8, fontWeight:300, maxWidth:380, marginBottom:32 }}>{s.desc}</p>
                {/* CTAs */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28, flexWrap:'wrap' }}>
                  <button onClick={() => router.push('/auth/signup')}
                    style={{ background:C.pink, color:'white', padding:'12px 28px', borderRadius:8, fontSize:'0.88rem', fontWeight:700, boxShadow:'0 6px 22px rgba(234,68,146,.38)', transition:'all .25s', display:'flex', alignItems:'center', gap:7 }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#D03A82';e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background=C.pink;e.currentTarget.style.transform='translateY(0)'}}>
                    Commencer gratuitement <IArrow/>
                  </button>
                  <button onClick={() => router.push('/auth/login')}
                    style={{ background:'transparent', color:'rgba(240,248,255,.65)', border:`1.5px solid rgba(255,255,255,.18)`, padding:'11px 24px', borderRadius:8, fontSize:'0.85rem', fontWeight:600, transition:'all .25s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,156,218,.5)';e.currentTarget.style.color=C.pinkS}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.18)';e.currentTarget.style.color='rgba(240,248,255,.65)'}}>
                    Voir la démo
                  </button>
                </div>
                {/* Pills */}
                <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                  {s.pills.map((p,j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, padding:'4px 11px', fontSize:'0.67rem', fontWeight:500, color:'rgba(240,248,255,.45)' }}>
                      <ICheck s={8}/> {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right visual */}
              <div className="carousel-right" style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
                <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
                  {/* Ghost stack */}
                  <div style={{ position:'absolute', top:20, right:-14, width:'92%', height:'calc(100% - 40px)', background:'rgba(255,156,218,.16)', border:'1px solid rgba(234,68,146,.15)', borderRadius:20, transform:'rotate(3deg)' }}/>
                  <div style={{ position:'absolute', top:10, right:-7,  width:'96%', height:'calc(100% - 20px)', background:'rgba(255,220,240,.2)',  border:'1px solid rgba(234,68,146,.1)',  borderRadius:20, transform:'rotate(1.5deg)' }}/>
                  <div style={{ position:'relative', zIndex:3 }}>{s.visual}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <div style={{ position:'absolute', bottom:36, left:'7%', display:'flex', alignItems:'center', gap:18, zIndex:10 }}>
          <div style={{ display:'flex', gap:7 }}>
            {SLIDES.map((_,i) => (
              <button key={i} onClick={() => { if(timerRef.current) clearTimeout(timerRef.current); goTo(i) }}
                style={{ width: i===slide?28:6, height:6, borderRadius:3, background: i===slide?C.pink:'rgba(255,255,255,.2)', border:'none', padding:0, cursor:'pointer', transition:'all .4s cubic-bezier(.16,1,.3,1)', boxShadow: i===slide?'0 2px 10px rgba(234,68,146,.5)':'none' }}/>
            ))}
          </div>
          <div style={{ display:'flex', gap:7 }}>
            {[{fn:prev,icon:<IArrowL/>},{fn:next,icon:<IArrow/>}].map((a,i) => (
              <button key={i} onClick={a.fn}
                style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(240,248,255,.55)', transition:'all .2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background=C.pink;e.currentTarget.style.borderColor=C.pink;e.currentTarget.style.color='white'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.borderColor='rgba(255,255,255,.1)';e.currentTarget.style.color='rgba(240,248,255,.55)'}}>
                {a.icon}
              </button>
            ))}
          </div>
          <span style={{ fontSize:'0.68rem', color:'rgba(240,248,255,.25)', fontWeight:500, letterSpacing:'1px' }}>
            {String(slide+1).padStart(2,'0')} / {String(SLIDES.length).padStart(2,'0')}
          </span>
        </div>

        {/* Floating notification */}
        <div style={{ position:'absolute', bottom:110, right:'6%', background:'white', borderRadius:13, padding:'10px 14px', boxShadow:'0 16px 48px rgba(4,27,45,.2)', display:'flex', alignItems:'center', gap:9, animation:'float 4s ease-in-out infinite', zIndex:10, whiteSpace:'nowrap' }}>
          <div style={{ width:32, height:32, background:C.pinkP, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:C.pink }}><ICalendar s={14}/></div>
          <div>
            <div style={{ fontSize:'0.7rem', fontWeight:700, color:C.ink }}>Nouvelle réservation !</div>
            <div style={{ fontSize:'0.6rem', color:'#9CA3AF', marginTop:1 }}>Amira · Coupe · 14:00</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          STRIP
      ═══════════════════════════════════ */}
      <div style={{ background:C.navy0, padding:'12px 0', overflow:'hidden', display:'flex', borderTop:'1px solid rgba(66,140,212,.08)', borderBottom:'1px solid rgba(66,140,212,.06)' }}>
        {[0,1].map(t => (
          <div key={t} aria-hidden={t===1} className="strip-track">
            {STRIP.map((item,j) => (
              <div key={j} style={{ display:'flex', alignItems:'center', gap:9, fontSize:'0.7rem', fontWeight:500, color: item.hi?'rgba(240,248,255,.7)':'rgba(240,248,255,.28)', letterSpacing:'.3px' }}>
                <div style={{ width:4, height:4, background:C.pink, transform:'rotate(45deg)', flexShrink:0 }}/>
                {item.t}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════
          PROBLEM
      ═══════════════════════════════════ */}
      <section style={{ background:C.navy2, padding:'88px 7%', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 50% 60% at 80% 30%,rgba(234,68,146,.06) 0%,transparent 55%)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <Eyebrow label="Le problème" light center/>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.06, color:C.onDark }}>
              Vous perdez des clientes <em style={{fontStyle:'italic',color:C.pinkS}}>chaque jour</em> sans le savoir
            </h2>
            <p style={{ fontSize:'0.92rem', color:C.faded, lineHeight:1.8, fontWeight:300, maxWidth:420, margin:'12px auto 0' }}>
              80% des salons tunisiens dépendent encore des appels manqués et des DMs Instagram.
            </p>
          </div>

          {/* 4 cards — uniform peach-red gradient */}
          <div className="problem-grid">
            {[
              { n:'1', icon:<IPhone s={22}/>,    title:'Appels manqués',           desc:'Une cliente appelle, personne ne répond. Elle réserve chez votre concurrente en 30 secondes.' },
              { n:'2', icon:<IGlobe s={22}/>,    title:'Pas de présence en ligne', desc:'Instagram ne suffit plus. Les clientes cherchent un site pro avec tarifs et réservation clairs.' },
              { n:'3', icon:<ICalendar s={22}/>, title:'Chaos de planning',        desc:'Papier, WhatsApp, mémoire… Les double-réservations arrivent. Le stress aussi.' },
              { n:'4', icon:<IClock s={22}/>,    title:'Fermée la nuit',           desc:'Vos clientes pensent à réserver à 22h. Vous êtes indisponible. La réservation ne se fait jamais.' },
            ].map((p,i) => (
              <div key={i}
                style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 8px 32px rgba(4,27,45,.3)', transition:'transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s', cursor:'default', display:'flex', flexDirection:'column' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 22px 56px rgba(4,27,45,.4)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 32px rgba(4,27,45,.3)'}}>

                {/* Top — uniform peach/coral gradient */}
                <div style={{ position:'relative', height:155, background:'linear-gradient(150deg,#EA4492 0%,#F4507A 50%,#FF7A5C 100%)', overflow:'hidden', flexShrink:0 }}>
                  {/* Blob */}
                  <div style={{ position:'absolute', bottom:-35, left:-25, width:170, height:170, background:'rgba(255,200,180,0.2)', borderRadius:'50%' }}/>
                  <div style={{ position:'absolute', top:-20, right:-20, width:110, height:110, background:'rgba(255,255,255,0.07)', borderRadius:'50%' }}/>
                  {/* Ghost number */}
                  <div style={{ position:'absolute', top:14, right:18, fontFamily:'Playfair Display,serif', fontSize:'4.8rem', fontWeight:900, lineHeight:1, color:'rgba(255,255,255,0.18)', letterSpacing:'-3px', userSelect:'none' }}>{p.n}</div>
                  {/* Icon tile */}
                  <div style={{ position:'absolute', bottom:20, left:22, width:46, height:46, borderRadius:13, background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>{p.icon}</div>
                </div>

                {/* Bottom */}
                <div style={{ padding:'22px 20px 26px', flex:1, display:'flex', flexDirection:'column', gap:9, background:'white' }}>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1rem', fontWeight:700, color:C.ink, lineHeight:1.3 }}>{p.title}</div>
                  <div style={{ fontSize:'0.78rem', color:'#7A8A96', lineHeight:1.75 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════ */}
      <section style={{ padding:'88px 7%', background:C.navy1 }}>
        <Eyebrow label="Comment ça marche" light/>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.06, color:C.onDark, marginBottom:8 }}>
          En ligne en <em style={{fontStyle:'italic',color:C.pinkS}}>5 minutes</em> chrono
        </h2>
        <p style={{ fontSize:'0.92rem', color:C.faded, lineHeight:1.8, maxWidth:400, marginBottom:52 }}>Pas de compétences techniques requises. Vraiment.</p>

        <div className="how-grid">
          <div>
            {[
              { n:'1', title:'Créez votre compte',     desc:'Nom du salon, téléphone, adresse. 2 minutes chrono.' },
              { n:'2', title:'Ajoutez vos services',   desc:'Prix, durée, catégorie. Votre catalogue en ligne est prêt.' },
              { n:'3', title:'Choisissez votre thème', desc:'Un design luxueux qui correspond à votre identité.' },
              { n:'4', title:'Partagez votre lien',    desc:'monsalon.beautyglow.tn — vos clientes réservent instantanément.' },
            ].map((s,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'46px 1fr', gap:14, marginBottom:i<3?26:0 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', border:`1.5px solid rgba(234,68,146,.25)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'0.88rem', fontWeight:700, color:C.pinkS, background:'rgba(234,68,146,.08)', flexShrink:0 }}>{s.n}</div>
                  {i<3 && <div style={{ width:1, flex:1, minHeight:20, background:'rgba(234,68,146,.15)', margin:'7px 0' }}/>}
                </div>
                <div style={{ paddingTop:7 }}>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.96rem', fontWeight:700, color:C.onDark, marginBottom:5 }}>{s.title}</div>
                  <div style={{ fontSize:'0.78rem', color:C.faded, lineHeight:1.75 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Browser mockup — white card */}
          <div className="how-browser" style={{ background:'white', borderRadius:18, overflow:'hidden', boxShadow:'0 28px 64px rgba(4,27,45,.35)', position:'sticky', top:90 }}>
            <div style={{ background:'#FFF5FA', padding:'10px 14px', display:'flex', alignItems:'center', gap:9, borderBottom:'1px solid rgba(234,68,146,.1)' }}>
              <div style={{ display:'flex', gap:4 }}>{['#FF5F57','#FEBC2E','#28C840'].map((c,i) => <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:c }}/>)}</div>
              <div style={{ flex:1, background:'rgba(234,68,146,.07)', borderRadius:5, padding:'4px 10px', fontSize:'0.62rem', color:C.muted, textAlign:'center' }}>yasmine.beautyglow.tn</div>
            </div>
            <div style={{ padding:18 }}>
              <div style={{ height:64, background:'linear-gradient(135deg,#FFF0F8,#F0F4FF)', borderRadius:9, marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(234,68,146,.08)' }}>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:'0.96rem', fontWeight:700, color:C.ink, fontStyle:'italic' }}>Salon Yasmine</span>
              </div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.84rem', fontWeight:700, color:C.ink, marginBottom:2 }}>Salon Yasmine</div>
              <div style={{ fontSize:'0.6rem', color:C.muted, display:'flex', alignItems:'center', gap:3, marginBottom:10 }}><IPin/>Avenue Habib Bourguiba, Tunis</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                {[['Coupe femme','35 TND'],['Coloration','80 TND'],['Brushing','25 TND'],['Manucure','20 TND']].map(([n,p],i) => (
                  <div key={i} style={{ background:'#FFF5FA', borderRadius:7, padding:'8px 9px', border:'1px solid rgba(234,68,146,.09)' }}>
                    <div style={{ fontSize:'0.6rem', fontWeight:600, color:C.ink, marginBottom:2 }}>{n}</div>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.76rem', fontWeight:700, color:C.pink }}>{p}</div>
                  </div>
                ))}
              </div>
              <button style={{ width:'100%', background:C.navy1, color:'white', borderRadius:7, padding:'9px', fontSize:'0.7rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:5, cursor:'default' }}>
                <ICalendar s={12}/> Réserver un rendez-vous
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURES
      ═══════════════════════════════════ */}
      <section id="features" style={{ padding:'88px 7%', background:C.navy2 }}>
        <Eyebrow label="Fonctionnalités" light/>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.06, color:C.onDark, marginBottom:52 }}>
          Tout ce dont votre salon <em style={{fontStyle:'italic',color:C.pinkS}}>a vraiment besoin</em>
        </h2>
        <div className="features-grid">
          <div>
            {FEATURES.map((f,i) => (
              <div key={i}
                style={{ display:'flex', gap:14, padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,.06)', cursor:'pointer', transition:'all .2s' }}
                onMouseEnter={() => setActiveFeat(i)}>
                <div style={{ width:38, height:38, borderRadius:9, background: activeFeat===i ? C.pink : 'rgba(234,68,146,.1)', border: activeFeat===i ? 'none' : '1px solid rgba(234,68,146,.2)', display:'flex', alignItems:'center', justifyContent:'center', color: activeFeat===i ? 'white' : C.pinkS, flexShrink:0, transition:'all .3s', boxShadow: activeFeat===i ? '0 6px 18px rgba(234,68,146,.35)' : 'none' }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily:'Playfair Display,serif', fontSize:'0.94rem', fontWeight:700, color: activeFeat===i ? C.pinkS : C.onDark, marginBottom:4, transition:'color .2s' }}>{f.title}</div>
                  <div style={{ fontSize:'0.76rem', color:C.faded, lineHeight:1.7, maxHeight: activeFeat===i ? 72 : 0, overflow:'hidden', opacity: activeFeat===i ? 1 : 0, transition:'max-height .35s cubic-bezier(.16,1,.3,1), opacity .25s' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual card — white+pink */}
          <div className="feat-visual" style={{ background:'white', borderRadius:20, padding:'40px 32px', border:'1px solid rgba(234,68,146,.1)', textAlign:'center', minHeight:280, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, position:'sticky', top:90, boxShadow:'0 20px 56px rgba(4,27,45,.25)', transition:'all .4s' }}>
            <div style={{ width:68, height:68, background:C.pink, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', color:'white', boxShadow:'0 8px 24px rgba(234,68,146,.4)' }}>
              <div style={{ transform:'scale(1.7)' }}>{FEATURES[activeFeat].icon}</div>
            </div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.2rem', fontWeight:700, color:C.ink }}>{FEATURES[activeFeat].title}</div>
            <div style={{ fontSize:'0.8rem', color:'#7A8A96', lineHeight:1.75, maxWidth:240 }}>{FEATURES[activeFeat].desc}</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          PRICING
      ═══════════════════════════════════ */}
      <section id="pricing" style={{ padding:'88px 7%', background:C.navy1 }}>
        <div style={{ textAlign:'center' }}>
          <Eyebrow label="Tarifs simples" light center/>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:900, letterSpacing:'-1.8px', color:C.onDark }}>
            Un rendez-vous suffit à <em style={{fontStyle:'italic',color:C.pinkS}}>rentabiliser</em>
          </h2>
          <p style={{ fontSize:'0.92rem', color:C.faded, lineHeight:1.8, maxWidth:380, margin:'10px auto 0' }}>Pas d&apos;engagement. Annulez quand vous voulez.</p>
        </div>
        <div className="pricing-grid">
          {[
            { tier:'Basic', price:'89', featured:false, feats:['Site web professionnel','Réservation en ligne','Dashboard complet','Galerie photos','Notifications email','Support standard'] },
            { tier:'Pro',   price:'149', featured:true,  feats:['Tout le plan Basic','Domaine personnalisé','Campagnes email','Statistiques avancées','Support prioritaire','Multi-staff (bientôt)'] },
          ].map((plan,i) => (
            <div key={i}
              style={{ background:'white', border: plan.featured ? 'none' : '1px solid rgba(234,68,146,.12)', borderRadius:20, padding:'36px 28px', position:'relative', overflow:'hidden', transition:'all .3s', boxShadow: plan.featured ? '0 24px 64px rgba(4,27,45,.4)' : '0 8px 24px rgba(4,27,45,.2)' }}
              onMouseEnter={e=>{ if(!plan.featured){e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 16px 48px rgba(4,27,45,.3)'} }}
              onMouseLeave={e=>{ if(!plan.featured){e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 24px rgba(4,27,45,.2)'} }}>
              {plan.featured && <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#EA4492,#FF9CDA)' }}/>}
              {plan.featured && <div style={{ position:'absolute', top:14, right:14, background:C.pinkP, border:'1px solid rgba(234,68,146,.25)', color:C.pink, fontSize:'0.56rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', padding:'3px 9px', borderRadius:20 }}>Populaire</div>}
              <span style={{ fontSize:'0.56rem', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color: plan.featured ? C.pink : '#9CA3AF', marginBottom:16, display:'block' }}>{plan.tier}</span>
              <div style={{ display:'flex', alignItems:'flex-end', gap:3, marginBottom:2 }}>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:'3.6rem', fontWeight:900, color:C.ink, lineHeight:1, letterSpacing:'-3px' }}>{plan.price}</span>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:'1.1rem', fontWeight:700, color:'#9CA3AF', marginBottom:5 }}>TND</span>
              </div>
              <div style={{ fontSize:'0.7rem', color:'#9CA3AF', marginBottom:20 }}>par mois · 14 jours gratuits</div>
              <div style={{ height:1, background:'rgba(4,27,45,.06)', marginBottom:16 }}/>
              <ul style={{ listStyle:'none', marginBottom:26, display:'flex', flexDirection:'column', gap:9 }}>
                {plan.feats.map((f,j) => (
                  <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:'0.78rem', color:'#5A6B78' }}>
                    <div style={{ width:16, height:16, borderRadius:'50%', background:C.pinkP, border:'1px solid rgba(234,68,146,.2)', display:'flex', alignItems:'center', justifyContent:'center', color:C.pink, flexShrink:0, marginTop:1 }}><ICheck s={8}/></div>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/auth/signup')}
                style={{ width:'100%', background: plan.featured ? C.pink : 'white', color: plan.featured ? 'white' : C.ink, border: plan.featured ? 'none' : `1.5px solid rgba(4,27,45,.14)`, borderRadius:8, padding:'11px', fontSize:'0.82rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all .25s', boxShadow: plan.featured ? '0 6px 18px rgba(234,68,146,.35)' : 'none' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';if(plan.featured){e.currentTarget.style.background='#D03A82'}else{e.currentTarget.style.background=C.ink;e.currentTarget.style.color='white'}}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';if(plan.featured){e.currentTarget.style.background=C.pink}else{e.currentTarget.style.background='white';e.currentTarget.style.color=C.ink}}}>
                Commencer gratuitement <IArrow s={12}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════ */}
      <section id="testimonials" style={{ padding:'88px 7%', background:C.navy2 }}>
        <Eyebrow label="Témoignages" light/>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:900, letterSpacing:'-1.8px', color:C.onDark }}>
          Elles nous font <em style={{fontStyle:'italic',color:C.pinkS}}>confiance</em>
        </h2>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i) => (
            <div key={i}
              style={{ background:'white', borderRadius:18, padding:'24px 20px', transition:'all .3s', position:'relative', overflow:'hidden', boxShadow:'0 8px 24px rgba(4,27,45,.2)', cursor:'default' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='0 18px 48px rgba(4,27,45,.3)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 24px rgba(4,27,45,.2)'}}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#EA4492,#FF9CDA)' }}/>
              <span style={{ fontFamily:'Playfair Display,serif', fontSize:'3rem', fontWeight:900, color:C.pinkP, lineHeight:.8, marginBottom:8, display:'block' }}>&ldquo;</span>
              <div style={{ display:'flex', gap:3, color:C.pink, marginBottom:9 }}>{[...Array(5)].map((_,j) => <IStar key={j}/>)}</div>
              <p style={{ fontFamily:'Playfair Display,serif', fontSize:'0.85rem', fontStyle:'italic', color:C.ink, lineHeight:1.8, marginBottom:16 }}>{t.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:9, paddingTop:14, borderTop:'1px solid rgba(234,68,146,.08)' }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${C.pinkS},${C.pink})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'0.86rem', fontWeight:700, color:'white', flexShrink:0 }}>{t.init}</div>
                <div>
                  <div style={{ fontSize:'0.78rem', fontWeight:700, color:C.ink }}>{t.name}</div>
                  <div style={{ fontSize:'0.64rem', color:C.pink, fontWeight:500 }}>{t.salon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA
      ═══════════════════════════════════ */}
      <section style={{ background:C.navy3, padding:'88px 7%', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 70% 80% at 5% 50%,rgba(234,68,146,.1) 0%,transparent 55%),radial-gradient(ellipse 50% 60% at 90% 30%,rgba(66,140,212,.08) 0%,transparent 55%)' }}/>
        <div className="cta-grid" style={{ position:'relative', zIndex:1 }}>
          <div>
            <Eyebrow label="Prête à briller ?" light/>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4.5vw,3.6rem)', fontWeight:900, letterSpacing:'-1.8px', lineHeight:1.04, color:C.onDark, marginBottom:12 }}>
              Lancez votre salon<br/>en ligne <em style={{fontStyle:'italic',color:C.pinkS}}>aujourd&apos;hui</em>
            </h2>
            <p style={{ fontSize:'0.9rem', color:C.faded, fontWeight:300, lineHeight:1.7 }}>14 jours gratuits. Aucune carte bancaire. Configuration en 5 minutes.</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:12, flexShrink:0 }}>
            <button onClick={() => router.push('/auth/signup')}
              style={{ background:'white', color:C.ink, padding:'15px 36px', borderRadius:9, fontSize:'0.9rem', fontWeight:700, fontFamily:'Plus Jakarta Sans,sans-serif', display:'flex', alignItems:'center', gap:7, whiteSpace:'nowrap', boxShadow:'0 6px 24px rgba(0,0,0,.18)', transition:'all .3s' }}
              onMouseEnter={e=>hoverPink(e)} onMouseLeave={e=>unhoverPink(e)}>
              Créer mon site gratuitement <IArrow/>
            </button>
            <span style={{ fontSize:'0.64rem', color:'rgba(240,248,255,.2)', display:'flex', alignItems:'center', gap:5 }}>
              <IZap/> Aucun engagement — Annulez quand vous voulez
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
      ═══════════════════════════════════ */}
      <footer style={{ background:C.navy0, padding:'36px 7%', borderTop:'1px solid rgba(255,255,255,.03)' }}>
        <div className="footer-inner">
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.05rem', fontWeight:700, color:C.onDark }}>Beauty<span style={{color:C.pinkS}}>Glow</span>.tn</div>
          <div className="footer-links" style={{ display:'flex', gap:22, flexWrap:'wrap' }}>
            {['Accueil','Tarifs','Contact','Confidentialité'].map((l,i) => (
              <a key={i} href="#" style={{ fontSize:'0.72rem', color:'rgba(255,255,255,.2)', fontWeight:400, transition:'color .2s' }}
                onMouseEnter={e=>(e.currentTarget.style.color=C.pinkS)} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,.2)')}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize:'0.66rem', color:'rgba(255,255,255,.08)' }}>© 2026 BeautyGlow. Tous droits réservés.</div>
        </div>
      </footer>
    </>
  )
}