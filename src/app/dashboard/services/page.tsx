// src/app/dashboard/services/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ServicesClient from './ServicesClient'

export default async function ServicesPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, plan_type')
    .eq('owner_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('display_order', { ascending: true })

  return (
    <ServicesClient
      services={services ?? []}
      businessId={business.id}
      planType={business.plan_type}
    />
  )
}