'use client'

import React, { useState, useEffect } from 'react'
import Navigation from '@/components/navigation/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import {
  User,
  Settings,
  Bell,
  Download,
  LogOut,
  Mail,
  UserCheck,
  Check,
  Loader2
} from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const supabase = createClient()

  // Form states
  const [fullName, setFullName] = useState('')
  const [dietaryPref, setDietaryPref] = useState<'mixed' | 'vegetarian' | 'meat'>('mixed')
  const [carbonGoal, setCarbonGoal] = useState<number>(10)
  
  // Settings states
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [aiAlerts, setAiAlerts] = useState(true)

  // System states
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Populate values when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setDietaryPref(profile.dietary_pref || 'mixed')
      setCarbonGoal(profile.carbon_goal || 10)
    }
  }, [profile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setUpdating(true)
    setSuccess(false)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          dietary_pref: dietaryPref,
          carbon_goal: parseFloat(carbonGoal.toString()) || 10.0,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        alert('Failed to update profile: ' + error.message)
      } else {
        setSuccess(true)
        await refreshProfile()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleExportData = async () => {
    if (!user) return
    setExporting(true)

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) {
        alert('Failed to export data: ' + error.message)
        return
      }

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data || [], null, 2)
      )}`
      
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', jsonString)
      downloadAnchor.setAttribute('download', `carboniq-data-export-${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
      <Navigation />

      <main className="flex-1 lg:pl-64 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white font-display">
              User Profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Manage your preferences, carbon targets, and account settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Avatar & Quick Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between text-center h-fit py-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 text-3xl font-bold font-display">
                  {fullName.substring(0, 1).toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-850 dark:text-white text-base">{fullName || 'Climate Hero'}</h3>
                  <span className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email}
                  </span>
                </div>
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-850 pt-6 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Carbon Daily Target:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">{carbonGoal} kg</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Diet Style:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350 capitalize">{dietaryPref}</span>
                </div>
              </div>

              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-rose-250 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold rounded-xl text-xs transition-all cursor-pointer group"
              >
                <LogOut className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Right Column: Preferences Form */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-5">
                  <Settings className="w-5 h-5 text-emerald-500" />
                  <span>Preferences & Settings</span>
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {success && (
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-sm">
                      <Check className="w-4 h-4" />
                      <span>Preferences saved successfully!</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Daily Carbon Target (kg CO₂e)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="100"
                        step="0.5"
                        value={carbonGoal}
                        onChange={(e) => setCarbonGoal(parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Dietary Preference
                      </label>
                      <select
                        value={dietaryPref}
                        onChange={(e: any) => setDietaryPref(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      >
                        <option value="mixed">Mixed Diet (Average)</option>
                        <option value="vegetarian">Vegetarian (Low impact)</option>
                        <option value="meat">Meat-Based (High impact)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Notification Toggles */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-850 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-500" />
                  <span>Notification Settings</span>
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all">
                    <input
                      type="checkbox"
                      checked={weeklyReport}
                      onChange={(e) => setWeeklyReport(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-550 border-slate-350 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Weekly Performance Report</span>
                      <span className="text-[10px] text-slate-400">Receive a weekly breakdown email comparing logs to targets.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all">
                    <input
                      type="checkbox"
                      checked={aiAlerts}
                      onChange={(e) => setAiAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-550 border-slate-350 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">AI Recommendation Alerts</span>
                      <span className="text-[10px] text-slate-400">Receive alerts when new personalized insights are compiled.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Export / Actions */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Data Integrity</span>
                  </h3>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 leading-relaxed">
                    Export your carbon calculation history logs in JSON format for external verification or auditing.
                  </p>
                </div>

                <button
                  onClick={handleExportData}
                  disabled={exporting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{exporting ? 'Exporting...' : 'Export My Logs (JSON)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
