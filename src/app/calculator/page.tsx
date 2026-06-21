'use client'

import React, { useState } from 'react'
import Navigation from '@/components/navigation/navigation'
import {
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateTreeEquivalent,
  getSustainabilityRating,
  EMISSION_FACTORS
} from '@/lib/carbon-utils'
import {
  Calculator,
  Trees,
  Scale,
  Car,
  Bus,
  Train,
  Utensils,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react'

export default function CarbonCalculatorPage() {
  // Inputs
  const [transportType, setTransportType] = useState<keyof typeof EMISSION_FACTORS.transportation>('car')
  const [distance, setDistance] = useState<number>(10)
  const [foodType, setFoodType] = useState<keyof typeof EMISSION_FACTORS.food>('mixed')
  const [electricity, setElectricity] = useState<number>(5)
  const [acHours, setAcHours] = useState<number>(2)

  // Calculations
  const transportEmissions = calculateTransportEmissions(transportType, distance)
  const foodEmissions = calculateFoodEmissions(foodType)
  const energyEmissions = calculateEnergyEmissions(electricity, acHours)
  const totalEmissions = parseFloat((transportEmissions + foodEmissions + energyEmissions).toFixed(2))

  const treesOffset = calculateTreeEquivalent(totalEmissions)
  const ratingInfo = getSustainabilityRating(totalEmissions)

  // Comparison helpers
  const carComparison = calculateTransportEmissions('car', distance)
  const busComparison = calculateTransportEmissions('bus', distance)
  const trainComparison = calculateTransportEmissions('train', distance)
  const cyclingComparison = calculateTransportEmissions('cycling', distance)

  const veganComparison = calculateFoodEmissions('vegetarian')
  const meatComparison = calculateFoodEmissions('meat')

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
      <Navigation />

      <main className="flex-1 lg:pl-64 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white font-display">
              Carbon footprint Estimator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Estimate and compare emission scenarios before you travel, eat, or power up.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Transport Calculator */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-500" />
                  <span>1. Transportation Travel</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Mode
                    </label>
                    <select
                      value={transportType}
                      onChange={(e) => setTransportType(e.target.value as any)}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                    >
                      <option value="car">Car (Gasoline)</option>
                      <option value="bus">Public Bus</option>
                      <option value="train">Train / Metro</option>
                      <option value="walking">Walking</option>
                      <option value="cycling">Cycling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Distance: {distance} km
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      step="5"
                      value={distance}
                      onChange={(e) => setDistance(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0 km</span>
                      <span>75 km</span>
                      <span>150+ km</span>
                    </div>
                  </div>
                </div>

                {/* Compare travel options */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 mt-2 border border-slate-100 dark:border-slate-850 space-y-2">
                  <h3 className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">Alternative Footprints (for {distance} km):</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-lg text-center">
                      <span className="block font-bold text-slate-800 dark:text-slate-100">{carComparison} kg</span>
                      <span className="text-[10px] text-slate-455">🚗 Car</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-lg text-center">
                      <span className="block font-bold text-slate-800 dark:text-slate-100">{busComparison} kg</span>
                      <span className="text-[10px] text-slate-455">🚌 Bus</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-lg text-center">
                      <span className="block font-bold text-slate-800 dark:text-slate-100">{trainComparison} kg</span>
                      <span className="text-[10px] text-slate-455">🚄 Train</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-lg text-center">
                      <span className="block font-bold text-emerald-500">{cyclingComparison} kg</span>
                      <span className="text-[10px] text-slate-455">🚲 Cycle/Walk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diet Calculator */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-500" />
                  <span>2. Dietary Choices</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'vegetarian', name: 'Vegetarian', value: veganComparison, desc: 'Zero meat' },
                    { id: 'mixed', name: 'Mixed Diet', value: foodEmissions, desc: 'Meat & veggies' },
                    { id: 'meat', name: 'Meat-Based', value: meatComparison, desc: 'Heavy meat' },
                  ].map((diet) => (
                    <button
                      key={diet.id}
                      onClick={() => setFoodType(diet.id as any)}
                      className={`flex flex-col items-center p-3.5 border rounded-xl transition-all cursor-pointer text-center ${
                        foodType === diet.id
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600 dark:text-emerald-450 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="text-xs uppercase font-semibold text-slate-400">{diet.name}</span>
                      <span className="text-xl font-bold mt-1 text-slate-850 dark:text-white">{diet.value} kg</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{diet.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Calculator */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <span>3. Home Energy & Utilities</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Electricity Usage: {electricity} kWh
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={electricity}
                      onChange={(e) => setElectricity(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0 kWh</span>
                      <span>15 kWh</span>
                      <span>30 kWh</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Air Conditioning: {acHours} Hours
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={acHours}
                      onChange={(e) => setAcHours(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0 hrs</span>
                      <span>12 hrs</span>
                      <span>24 hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Cards */}
            <div className="space-y-6">
              {/* Scorecard */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-4">
                    <Scale className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Estimated Scenario Footprint</span>
                  </h3>
                  <div className="text-center py-4 bg-slate-850/30 rounded-2xl border border-slate-800">
                    <span className="text-5xl font-extrabold font-display text-emerald-400">
                      {totalEmissions}
                    </span>
                    <span className="block text-slate-400 text-xs font-semibold mt-1">
                      kg CO₂e / day
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Rating Label */}
                  <div className="rounded-xl p-3 text-center text-xs font-bold leading-normal">
                    <div className={`p-2.5 rounded-lg ${ratingInfo.color}`}>
                      Rating: {ratingInfo.rating}
                    </div>
                  </div>

                  {/* Equivalent offset */}
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                      <Trees className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 leading-normal">Trees to absorb this in a year</p>
                      <p className="font-bold text-sm text-slate-200 mt-0.5">{treesOffset} mature trees</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip box */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-250/20 dark:border-emerald-900 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4" />
                  <span>Calculator Insight</span>
                </h4>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
                  Choosing a train over a car for a 20 km trip cuts your carbon impact by 77%! Log this action on the activity tracker to count it toward your analytics.
                </p>
                <a
                  href="/log"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-350 cursor-pointer group"
                >
                  <span>Go to logger</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
