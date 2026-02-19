// src/app/sites/[subdomain]/page.tsx
// Public salon website — accessible at [subdomain].beautyglow.tn
// Looks up business by subdomain and displays their info

import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { error } from 'console'

// Service role client for public pages — bypasses RLS safely
// This is a server component so the service role key is never exposed to browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function SalonPage({ 
  params 
}: { 
  params: Promise<{ subdomain: string }>
}) {
  // Await params — required in Next.js 15
  const { subdomain } = await params
  // Look up business by subdomain
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('subdomain', subdomain)
    .limit(1)

    const business = businesses?.[0] || null
  
  // Look up their services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business?.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (!business) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Salon not found</h1>
        <p>This salon doesn&apos;t exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {business.logo_url && (
          <Image
            src={business.logo_url}
            alt={business.business_name}
            width={100}
            height={100}
            style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' }}
          />
        )}
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{business.business_name}</h1>
        <p style={{ color: '#666', marginBottom: '8px' }}>{business.address}</p>
        <p style={{ color: '#666' }}>{business.phone}</p>
        {business.description && (
          <p style={{ marginTop: '16px', maxWidth: '500px', margin: '16px auto 0' }}>
            {business.description}
          </p>
        )}
        
          <a href="/booking"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '12px 30px',
              background: '#EC4899',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Book an Appointment
          </a>
      </div>

      {/* Services */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>Our Services</h2>
        {services && services.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {services.map((service) => (
              <div
                key={service.id}
                style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}
              >
                <h3 style={{ marginBottom: '8px' }}>{service.name}</h3>
                {service.description && (
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{service.description}</p>
                )}
                <p style={{ color: '#EC4899', fontWeight: 'bold', marginBottom: '4px' }}>{service.price} TND</p>
                <p style={{ color: '#999', fontSize: '13px' }}>{service.duration_minutes} min</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No services added yet.</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '60px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
        <p>Powered by <a href="https://beautyglow.tn" style={{ color: '#EC4899' }}>BeautyGlow</a></p>
      </div>
    </div>
  )
}