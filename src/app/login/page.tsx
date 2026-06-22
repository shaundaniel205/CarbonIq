'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Leaf, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import type { SupabaseClient } from '@supabase/supabase-js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const router = useRouter()

  // Initialize Supabase client on mount (client side only)
  React.useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
      console.log('✅ Supabase client initialized successfully')
    } catch (err: any) {
      console.error('❌ Failed to initialize Supabase client:', err?.message)
      setClientError(err?.message || 'Failed to initialize authentication')
    }
  }, [])

  // Debug: Log environment variables on mount
  React.useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('🔧 Supabase Configuration Debug:')
    console.log('📍 URL:', supabaseUrl)
    console.log('🔑 Key:', supabaseKey ? `${supabaseKey.slice(0, 10)}...` : 'NOT SET')
    console.log('📋 Full URL:', supabaseUrl)
    console.log('📋 Full Key:', supabaseKey)
    console.log('✅ Valid URL:', supabaseUrl?.startsWith('https://'))
    console.log('✅ Key exists:', !!supabaseKey)
    console.log('⚠️  URL is placeholder:', supabaseUrl?.includes('placeholder'))
    console.log('⚠️  Key is placeholder:', supabaseKey?.includes('placeholder'))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!supabase) {
      setError(clientError || 'Supabase client not initialized')
      setLoading(false)
      return
    }

    try {
      console.log('🔐 Login attempt for:', email)
      console.log('📡 Calling signInWithPassword...')

      const { error: authError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📬 Response received:', { authError, data })

      if (authError) {
        console.error('❌ Auth error:', authError)
        setError(`Auth Error: ${authError.message}`)
      } else {
        console.log('✅ Login successful!')
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('💥 Exception caught:', err)
      console.error('Error message:', err?.message)
      console.error('Error type:', err?.constructor?.name)
      console.error('Stack:', err?.stack)
      setError(`Network Error: ${err?.message || 'Failed to fetch'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="w-full max-w-md">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 mb-3">
            <Leaf className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
            Carbon<span className="text-emerald-500">IQ</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-xs">
            Your AI-powered climate copilot for smarter daily decisions.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-8 transition-all">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">
            Welcome Back
          </h2>

          {(error || clientError) && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <span>{error || clientError}</span>
                {clientError && (
                  <div className="text-xs mt-2 p-2 bg-red-100 dark:bg-red-900/50 rounded">
                    <p className="font-mono">Check browser console for details</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!clientError}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-emerald-500 hover:underline font-semibold"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
