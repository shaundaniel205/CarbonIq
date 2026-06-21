'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navigation from '@/components/navigation/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import {
  TrendingDown,
  TrendingUp,
  PlusCircle,
  Leaf,
  Scale,
  Sparkles,
  ChevronRight,
  Flame,
  CalendarDays
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts'

interface Activity {
  id: string
  date: string
  category: 'transportation' | 'food' | 'energy'
  emissions: number
  details: any
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])
  const [mounted, setMounted] = useState(false)

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching activities:', error)
      } else {
        setActivities(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    setMounted(true)
    fetchActivities()
  }, [fetchActivities])

  // Math calculations
  const getDailyEmissions = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    return activities
      .filter((a) => a.date === todayStr)
      .reduce((sum, a) => sum + a.emissions, 0)
  }

  const getWeeklyEmissions = () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return activities
      .filter((a) => new Date(a.date) >= sevenDaysAgo)
      .reduce((sum, a) => sum + a.emissions, 0)
  }

  const getMonthlyEmissions = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return activities
      .filter((a) => new Date(a.date) >= thirtyDaysAgo)
      .reduce((sum, a) => sum + a.emissions, 0)
  }

  // Calculate improvement percentage
  // Comparing last 7 days with the 7 days before that
  const getImprovementMetric = () => {
    const now = new Date()
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(now.getDate() - 7)
    
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(now.getDate() - 14)

    const currentWeekEmissions = activities
      .filter((a) => {
        const d = new Date(a.date)
        return d >= sevenDaysAgo && d <= now
      })
      .reduce((sum, a) => sum + a.emissions, 0)

    const prevWeekEmissions = activities
      .filter((a) => {
        const d = new Date(a.date)
        return d >= fourteenDaysAgo && d < sevenDaysAgo
      })
      .reduce((sum, a) => sum + a.emissions, 0)

    if (prevWeekEmissions === 0) return { percent: 0, improved: true }
    
    const diff = prevWeekEmissions - currentWeekEmissions
    const percent = parseFloat(((diff / prevWeekEmissions) * 100).toFixed(1))
    
    return {
      percent: Math.abs(percent),
      improved: percent >= 0
    }
  }

  // Format charts data
  const getPieData = () => {
    const categories = { transportation: 0, food: 0, energy: 0 }
    activities.forEach((a) => {
      if (a.category in categories) {
        categories[a.category] += a.emissions
      }
    })

    return [
      { name: 'Transport', value: parseFloat(categories.transportation.toFixed(2)), color: '#3b82f6' }, // Blue
      { name: 'Food', value: parseFloat(categories.food.toFixed(2)), color: '#f59e0b' },           // Amber
      { name: 'Energy', value: parseFloat(categories.energy.toFixed(2)), color: '#10b981' }         // Green
    ].filter((item) => item.value > 0)
  }

  const getLineData = () => {
    // Group by date for last 7 days
    const dailyMap: Record<string, number> = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(now.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      dailyMap[dateStr] = 0
    }

    activities.forEach((a) => {
      if (a.date in dailyMap) {
        dailyMap[a.date] += a.emissions
      }
    })

    return Object.entries(dailyMap).map(([date, value]) => {
      // format date as "Mon 15"
      const dateObj = new Date(date)
      const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
      return {
        date: label,
        emissions: parseFloat(value.toFixed(2))
      }
    })
  }

  const getBarData = () => {
    // Compare emissions by categories monthly
    // Let's create comparison for last 3 months
    const now = new Date()
    const months = [2, 1, 0].map((offset) => {
      const d = new Date()
      d.setMonth(now.getMonth() - offset)
      return {
        monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        transportation: 0,
        food: 0,
        energy: 0
      }
    })

    activities.forEach((a) => {
      const aMonthKey = a.date.substring(0, 7) // "YYYY-MM"
      const matched = months.find((m) => m.monthKey === aMonthKey)
      if (matched) {
        matched[a.category] += a.emissions
      }
    })

    return months.map((m) => ({
      name: m.label,
      Transport: parseFloat(m.transportation.toFixed(2)),
      Food: parseFloat(m.food.toFixed(2)),
      Energy: parseFloat(m.energy.toFixed(2))
    }))
  }

  const dailyTotal = parseFloat(getDailyEmissions().toFixed(2))
  const weeklyTotal = parseFloat(getWeeklyEmissions().toFixed(2))
  const monthlyTotal = parseFloat(getMonthlyEmissions().toFixed(2))
  const improvement = getImprovementMetric()

  const pieData = getPieData()
  const lineData = getLineData()
  const barData = getBarData()

  const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981']

  if (loading) {
    return (
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
        <Navigation />
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Skeleton Header */}
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>

          {/* Skeleton Hero Card */}
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />

          {/* Skeleton Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>

          {/* Skeleton Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
      <Navigation />

      <main className="flex-1 lg:pl-64 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white font-display">
                Welcome back, {profile?.full_name || 'Climate Hero'}!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Here is your environmental footprint review.
              </p>
            </div>
            
            <Link
              href="/log"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/10 transition-all text-sm cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>Log Activity</span>
            </Link>
          </div>

          {activities.length === 0 ? (
            /* Empty State CTA */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm space-y-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
                <Leaf className="w-8 h-8 animate-bounce" />
              </div>
              <div className="max-w-sm mx-auto space-y-2">
                <h2 className="text-xl font-bold text-slate-850 dark:text-white">Start tracking today</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Start tracking today to see your environmental impact and unlock AI-powered green tips.
                </p>
              </div>
              <Link
                href="/log"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/15 transition-all text-sm cursor-pointer"
              >
                Log First Activity
              </Link>
            </div>
          ) : (
            <>
              {/* Hero Impact Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg shadow-emerald-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                    Footprint Status
                  </span>
                  <h2 className="text-3xl font-extrabold font-display">
                    {weeklyTotal} kg CO₂e
                  </h2>
                  <p className="text-emerald-50/80 text-sm">
                    Total carbon emissions accumulated in the last 7 days.
                  </p>
                </div>

                <div className="flex gap-4 items-center shrink-0">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 text-white">
                      {improvement.improved ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-emerald-100/70 font-bold tracking-wide">Weekly Trend</p>
                      <p className="font-extrabold text-base mt-0.5">
                        {improvement.percent > 0 ? (
                          <>
                            {improvement.percent}% {improvement.improved ? 'Decrease' : 'Increase'}
                          </>
                        ) : (
                          'Stable'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-1.5">
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">Daily Footprint</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-850 dark:text-white font-display">{dailyTotal}</span>
                    <span className="text-xs text-slate-450 dark:text-slate-500">kg CO₂e</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Today's activity totals</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-1.5">
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">Weekly Footprint</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-850 dark:text-white font-display">{weeklyTotal}</span>
                    <span className="text-xs text-slate-450 dark:text-slate-500">kg CO₂e</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Target limit: {((profile?.carbon_goal || 10) * 7).toFixed(1)} kg</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-1.5">
                  <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">Monthly Footprint</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-850 dark:text-white font-display">{monthlyTotal}</span>
                    <span className="text-xs text-slate-450 dark:text-slate-500">kg CO₂e</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Last 30 rolling days</span>
                  </div>
                </div>
              </div>

              {/* Recharts Analytics Section */}
              {mounted && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Line Chart */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-emerald-500" />
                        <span>Daily Trend (Last 7 Days)</span>
                      </h3>
                    </div>
                    <div className="h-60 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '11px',
                            }}
                          />
                          <Line type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-500" />
                      <span>Emissions by Category</span>
                    </h3>
                    
                    {pieData.length === 0 ? (
                      <div className="h-60 flex items-center justify-center text-xs text-slate-400">
                        No category breakdown available
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 items-center">
                        <div className="col-span-3 h-60 w-full text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  background: 'rgba(15, 23, 42, 0.95)',
                                  border: 'none',
                                  borderRadius: '8px',
                                  color: '#fff',
                                  fontSize: '11px',
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Custom Legend */}
                        <div className="col-span-2 space-y-3 pl-2 text-xs">
                          {pieData.map((item, index) => (
                            <div key={item.name} className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="font-semibold text-slate-700 dark:text-slate-350">{item.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-450 dark:text-slate-500 pl-5 font-bold">{item.value} kg ({Math.round(item.value / (pieData.reduce((sum, i) => sum + i.value, 0) || 1) * 100)}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bar Chart (Monthly Comparison) */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-emerald-500" />
                      <span>Monthly Breakdown (Category Comparison)</span>
                    </h3>
                    <div className="h-64 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '11px',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="Transport" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Food" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Energy" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Recommendations Preview Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-950 text-emerald-500 rounded-xl shadow-sm shrink-0 border border-emerald-100 dark:border-emerald-900">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Unlock Personalized Insights</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-lg">
                      Let our AI analyzer study your daily transportation, diet, and energy metrics to generate actionable, custom climate advice.
                    </p>
                  </div>
                </div>
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-350 shrink-0 cursor-pointer group"
                >
                  <span>View Recommendations</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
