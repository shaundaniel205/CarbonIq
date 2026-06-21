import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const debug = {
    env: {
      supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
      supabaseUrlValue: supabaseUrl,
      supabaseKey: supabaseKey ? 'SET' : 'NOT SET',
      serviceRoleKey: serviceRoleKey ? 'SET' : 'NOT SET',
    },
    validation: {
      urlValid: supabaseUrl?.startsWith('https://') ?? false,
      urlNotPlaceholder: !supabaseUrl?.includes('placeholder'),
      keyNotPlaceholder: !supabaseKey?.includes('placeholder'),
      keyLength: supabaseKey?.length ?? 0,
    },
    tests: [] as any[],
  }

  // Test 1: Try to reach Supabase URL
  if (supabaseUrl) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey || '',
        },
      })
      debug.tests.push({
        test: 'Fetch Supabase REST API',
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      })
    } catch (error: any) {
      debug.tests.push({
        test: 'Fetch Supabase REST API',
        error: error?.message,
        type: error?.constructor?.name,
      })
    }
  }

  // Test 2: Check if credentials are placeholders
  if (supabaseUrl?.includes('placeholder')) {
    debug.tests.push({
      test: 'Placeholder Detection',
      issue: 'NEXT_PUBLIC_SUPABASE_URL contains "placeholder" - credentials not configured',
      action: 'Update .env.local with real Supabase credentials',
    })
  }

  if (supabaseKey?.includes('placeholder')) {
    debug.tests.push({
      test: 'Placeholder Detection',
      issue: 'NEXT_PUBLIC_SUPABASE_ANON_KEY contains "placeholder" - credentials not configured',
      action: 'Update .env.local with real Supabase credentials',
    })
  }

  return NextResponse.json(debug, { status: 200 })
}
