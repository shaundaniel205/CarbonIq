'use client'
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/navigation/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import {
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  EMISSION_FACTORS
} from '@/lib/carbon-utils'
import {
  Car,
  Utensils,
  Zap,
  Calendar,
  Plus,
  Trash2,
  Check,
  Footprints,
  Bus,
  Train,
  Bike,
  FlameKindling
} from 'lucide-react'

type Category = 'transportation' | 'food' | 'energy'

interface ActivityLog {
  id: string
  date: string
  category: Category
  details: any
  emissions: number
  created_at: string
}

export default function LogActivityPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [activeCategory, setActiveCategory] = useState<Category>('transportation')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [logsLoading, setLogsLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Transportation states
  const [transportType, setTransportType] = useState<keyof typeof EMISSION_FACTORS.transportation>('car')
  const [distance, setDistance] = useState<string>('')

  // Food states
  const [foodType, setFoodType] = useState<keyof typeof EMISSION_FACTORS.food>('mixed')

  // Energy states
  const [electricity, setElectricity] = useState<string>('')
  const [acHours, setAcHours] = useState<string>('')

  // Fetch recent logs
  const fetchRecentLogs = useCallback(async () => {
    if (!user) return
    setLogsLoading(true)
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching logs:', error)
      } else {
        setLogs(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLogsLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchRecentLogs()
  }, [fetchRecentLogs])

  const handleDeleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Failed to delete log: ' + error.message)
      } else {
        setLogs((prev) => prev.filter((log) => log.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setSuccessMsg(null)

    let calculatedEmissions = 0
    let details: any = {}

    if (activeCategory === 'transportation') {
      const distNum = parseFloat(distance) || 0
      calculatedEmissions = calculateTransportEmissions(transportType, distNum)
      details = { type: transportType, distance: distNum }
    } else if (activeCategory === 'food') {
      calculatedEmissions = calculateFoodEmissions(foodType)
      details = { type: foodType }
    } else if (activeCategory === 'energy') {
      const elecNum = parseFloat(electricity) || 0
      const acNum = parseFloat(acHours) || 0
      calculatedEmissions = calculateEnergyEmissions(elecNum, acNum)
      details = { electricity: elecNum, acHours: acNum }
    }

    try {
      const { error } = await supabase.from('activities').insert({
        user_id: user.id,
        date,
        category: activeCategory,
        details,
        emissions: calculatedEmissions,
      })

      if (error) {
        alert('Error saving activity: ' + error.message)
      } else {
        setSuccessMsg('Activity logged successfully!')
        setDistance('')
        setElectricity('')
        setAcHours('')
        setTimeout(() => setSuccessMsg(null), 3000)
        fetchRecentLogs()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <Car className="w-4 h-4" />
      case 'bus':
        return <Bus className="w-4 h-4" />
      case 'train':
        return <Train className="w-4 h-4" />
      case 'walking':
        return <Footprints className="w-4 h-4" />
      case 'cycling':
        return <Bike className="w-4 h-4" />
      default:
        return <Car className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white font-display">
              Log Activity
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Record your daily habits to calculate and monitor your carbon footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => {
                      setActiveCategory('transportation')
                      setSuccessMsg(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      activeCategory === 'transportation'
                        ? 'border-emerald-500 text-emerald-500 bg-emerald-50/10'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Transport</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory('food')
                      setSuccessMsg(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      activeCategory === 'food'
                        ? 'border-emerald-500 text-emerald-500 bg-emerald-50/10'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>Food</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory('energy')
                      setSuccessMsg(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      activeCategory === 'energy'
                        ? 'border-emerald-500 text-emerald-500 bg-emerald-50/10'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Energy</span>
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSaveActivity} className="p-6 space-y-5">
                  {successMsg && (
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-sm">
                      <Check className="w-4 h-4" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Activity Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Transportation Form */}
                  {activeCategory === 'transportation' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Select Vehicle Type
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {(['car', 'bus', 'train', 'walking', 'cycling'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setTransportType(type)}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                transportType === type
                                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850'
                              }`}
                            >
                              {getTransportIcon(type)}
                              <span className="capitalize">{type}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Distance Traveled (km)
                        </label>
                        <input
                          type="number"
                          required
                          min="0.1"
                          step="0.1"
                          placeholder="e.g. 15.5"
                          value={distance}
                          onChange={(e) => setDistance(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Food Form */}
                  {activeCategory === 'food' && (
                    <div className="space-y-4">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Select Diet for Today
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'vegetarian', name: 'Vegetarian', desc: 'No meat, focusing on greens & grains' },
                          { id: 'mixed', name: 'Mixed Diet', desc: 'Average meat & veggie consumption' },
                          { id: 'meat', name: 'Meat-Based', desc: 'Heavy on meats and poultry products' },
                        ].map((diet) => (
                          <button
                            key={diet.id}
                            type="button"
                            onClick={() => setFoodType(diet.id as any)}
                            className={`flex flex-col items-start text-left p-4 rounded-xl border cursor-pointer transition-all ${
                              foodType === diet.id
                                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 ring-2 ring-emerald-500/10'
                                : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            <span className="font-bold text-sm text-slate-850 dark:text-slate-100 capitalize">{diet.name}</span>
                            <span className="text-[11px] text-slate-400 mt-1 leading-normal">{diet.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Energy Form */}
                  {activeCategory === 'energy' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Electricity Used (kWh)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.1"
                            placeholder="e.g. 8.2"
                            value={electricity}
                            onChange={(e) => setElectricity(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            AC Run Time (Hours)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            max="24"
                            step="0.5"
                            placeholder="e.g. 4.5"
                            value={acHours}
                            onChange={(e) => setAcHours(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm mt-6"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{loading ? 'Saving Entry...' : 'Save Activity'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Calculations Preview Sidebar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-fit space-y-6">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <FlameKindling className="w-4 h-4 text-emerald-500" />
                  <span>Emissions Preview</span>
                </h2>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 text-center border border-slate-100 dark:border-slate-850">
                  <span className="text-3xl font-extrabold text-slate-850 dark:text-white font-display">
                    {activeCategory === 'transportation'
                      ? calculateTransportEmissions(transportType, parseFloat(distance) || 0)
                      : activeCategory === 'food'
                      ? calculateFoodEmissions(foodType)
                      : calculateEnergyEmissions(parseFloat(electricity) || 0, parseFloat(acHours) || 0)}
                  </span>
                  <span className="text-slate-450 dark:text-slate-500 block text-xs font-semibold mt-1">
                    kg CO₂e
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 text-xs text-slate-500 space-y-2.5">
                <p className="font-semibold text-slate-700 dark:text-slate-350">Factors applied:</p>
                {activeCategory === 'transportation' && (
                  <p>• {transportType} emits {EMISSION_FACTORS.transportation[transportType]} kg CO₂e per kilometer.</p>
                )}
                {activeCategory === 'food' && (
                  <p>• {foodType} diet is estimated at {EMISSION_FACTORS.food[foodType]} kg CO₂e per serving day.</p>
                )}
                {activeCategory === 'energy' && (
                  <>
                    <p>• Grid electricity is rated at {EMISSION_FACTORS.energy.electricity} kg CO₂e per kWh.</p>
                    <p>• Air conditioning adds {EMISSION_FACTORS.energy.ac} kg CO₂e per hour.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recent Logs List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Recent Log History
            </h2>

            {logsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-12 text-center text-slate-450 dark:text-slate-500 text-sm">
                No activities logged yet. Start tracking above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase tracking-wider text-[11px] font-bold">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Details</th>
                      <th className="pb-3">Emissions</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {logs.map((log) => (
                      <tr key={log.id} className="text-slate-700 dark:text-slate-350">
                        <td className="py-3.5 font-medium">{log.date}</td>
                        <td className="py-3.5 capitalize">
                          <span className="flex items-center gap-1.5">
                            {log.category === 'transportation' && <Car className="w-3.5 h-3.5 text-blue-500" />}
                            {log.category === 'food' && <Utensils className="w-3.5 h-3.5 text-amber-500" />}
                            {log.category === 'energy' && <Zap className="w-3.5 h-3.5 text-emerald-500" />}
                            <span>{log.category}</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-slate-500">
                          {log.category === 'transportation' && (
                            <span>{log.details.type} • {log.details.distance} km</span>
                          )}
                          {log.category === 'food' && (
                            <span>{log.details.type} diet</span>
                          )}
                          {log.category === 'energy' && (
                            <span>{log.details.electricity} kWh • {log.details.acHours} hrs AC</span>
                          )}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-100">
                          {log.emissions} kg CO₂e
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-450 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
