'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Middleware handles auth-based redirects automatically.
    // Client router acts as an immediate fallback loader.
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 animate-bounce">
          <Leaf className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
          Carbon<span className="text-emerald-500">IQ</span>
        </h1>
        <div className="w-8 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
          <div className="w-full h-full bg-emerald-500 animate-infinite-loading" />
        </div>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
          Connecting to Climate Copilot...
        </p>
      </div>
    </div>
  )
}

