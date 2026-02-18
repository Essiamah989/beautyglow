// src/app/onboarding/page.tsx
// Multi-step onboarding wizard for new salon owners
// Step 1: Business info (name, phone, address, description)
// Step 2: Subdomain selection
// Step 3: Add services (Day 6)
// Step 4: Logo upload (Day 6)

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1 fields
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  // Step 2 fields
  const [subdomain, setSubdomain] = useState('')
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null)
  const [checkingSubdomain, setCheckingSubdomain] = useState(false)

  const [error, setError] = useState('')

  // Check if subdomain is available in the database
  const checkSubdomain = async (value: string) => {
    if (value.length < 3) return
    setCheckingSubdomain(true)

    const { data } = await supabase
      .from('businesses')
      .select('id')
      .eq('subdomain', value)
      .single()

    // If no data found, subdomain is available
    setSubdomainAvailable(!data)
    setCheckingSubdomain(false)
  }

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto', padding: '20px' }}>
      <h1>Set up your salon — Step {step} of 4</h1>

      {/* STEP 1: Business Info */}
      {step === 1 && (
        <div>
          <h2>Business Information</h2>

          <input
            placeholder="Salon name *"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <input
            placeholder="Phone number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <input
            placeholder="Address *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
          />
          <textarea
            placeholder="Short description of your salon"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', height: '100px' }}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            onClick={() => {
              if (!businessName || !phone || !address) {
                setError('Please fill in all required fields')
                return
              }
              setError('')
              setStep(2)
            }}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Next →
          </button>
        </div>
      )}

      {/* STEP 2: Subdomain */}
      {step === 2 && (
        <div>
          <h2>Choose your website address</h2>
          <p style={{ color: '#666' }}>
            Your salon will be available at: <strong>{subdomain || 'yourname'}.beautyglow.tn</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <input
              placeholder="yourname"
              value={subdomain}
              onChange={(e) => {
                // Only allow lowercase letters, numbers, hyphens
                const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                setSubdomain(value)
                setSubdomainAvailable(null)
              }}
              style={{ padding: '8px', flex: 1 }}
            />
            <span>.beautyglow.tn</span>
          </div>

          <button
            onClick={() => checkSubdomain(subdomain)}
            disabled={subdomain.length < 3 || checkingSubdomain}
            style={{ padding: '8px 16px', marginBottom: '10px', cursor: 'pointer' }}
          >
            {checkingSubdomain ? 'Checking...' : 'Check availability'}
          </button>

          {subdomainAvailable === true && (
            <p style={{ color: 'green' }}>✅ {subdomain}.beautyglow.tn is available!</p>
          )}
          {subdomainAvailable === false && (
            <p style={{ color: 'red' }}>❌ Already taken, try another name</p>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              ← Back
            </button>
            <button
              onClick={() => {
                if (!subdomainAvailable) {
                  setError('Please choose an available subdomain')
                  return
                }
                setError('')
                setStep(3)
              }}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 & 4 — Coming in Day 6 */}
      {step === 3 && (
        <div>
          <h2>Coming soon — Services setup</h2>
          <button onClick={() => setStep(2)} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}