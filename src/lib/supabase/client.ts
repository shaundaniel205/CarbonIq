import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Client-side only: Validate credentials on the browser
  if (typeof window !== 'undefined') {
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase credentials!')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET')
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'NOT SET')
      throw new Error(
        'Supabase credentials are not configured. Please check .env.local file.'
      )
    }

    if (supabaseUrl.includes('placeholder')) {
      console.error('❌ Supabase URL contains placeholder values!')
      console.error('Current URL:', supabaseUrl)
      throw new Error(
        'Supabase URL is not configured correctly. Replace placeholder-project with your real Supabase project ID.'
      )
    }

    if (supabaseKey.includes('placeholder')) {
      console.error('❌ Supabase key contains placeholder values!')
      throw new Error(
        'Supabase anonymous key is not configured correctly. Replace placeholder-anon-key with your real key.'
      )
    }

    console.log('✅ Supabase client initialized')
    console.log('📍 URL:', supabaseUrl)
    console.log('🔑 Key prefix:', supabaseKey.slice(0, 10) + '...')
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || ''
  )
}
