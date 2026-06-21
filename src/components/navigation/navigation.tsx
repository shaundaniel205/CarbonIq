'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../providers/auth-provider'
import {
  LayoutDashboard,
  PlusCircle,
  Calculator,
  Sparkles,
  User,
  LogOut,
  Leaf
} from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Log Activity', href: '/log', icon: PlusCircle },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'AI Insights', href: '/insights', icon: Sparkles },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-20">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
            <Leaf className="w-5.5 h-5.5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
            Carbon<span className="text-emerald-500">IQ</span>
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-550 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer group"
          >
            <LogOut className="w-5 h-5 text-rose-500 group-hover:translate-x-1 transition-transform" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-3 flex justify-around items-center z-35 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                active
                  ? 'text-emerald-500 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className={`w-5.5 h-5.5 transition-transform ${active ? 'scale-110' : 'opacity-70'}`} />
              <span className="text-[10px] tracking-wide">{item.name.split(' ')[0]}</span>
            </Link>
          )}
        )}
      </nav>
    </>
  )
}
