import { supabase } from '@/lib/supabase'

export default async function TestPage() {
  const { data, error } = await supabase.from('businesses').select('*')

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p style={{ color: 'red' }}>❌ Error: {error.message}</p>
      ) : (
        <p style={{ color: 'green' }}>✅ Connected! Businesses in DB: {data?.length ?? 0}</p>
      )}
    </div>
  )
}