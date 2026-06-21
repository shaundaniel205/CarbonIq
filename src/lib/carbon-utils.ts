export const EMISSION_FACTORS = {
  transportation: {
    car: 0.18,      // kg CO2e per km
    bus: 0.089,     // kg CO2e per km
    train: 0.041,    // kg CO2e per km
    walking: 0.0,   // kg CO2e per km
    cycling: 0.0,   // kg CO2e per km
  },
  food: {
    vegetarian: 1.5, // kg CO2e per meal/day
    mixed: 2.5,      // kg CO2e per meal/day
    meat: 4.5,       // kg CO2e per meal/day
  },
  energy: {
    electricity: 0.45, // kg CO2e per kWh
    ac: 0.6,           // kg CO2e per hour of use
  }
}

export function calculateTransportEmissions(type: keyof typeof EMISSION_FACTORS.transportation, distance: number): number {
  const factor = EMISSION_FACTORS.transportation[type] ?? 0
  return parseFloat((distance * factor).toFixed(2))
}

export function calculateFoodEmissions(type: keyof typeof EMISSION_FACTORS.food): number {
  return EMISSION_FACTORS.food[type] ?? 0
}

export function calculateEnergyEmissions(electricityKwh: number, acHours: number): number {
  const electricityEmissions = electricityKwh * EMISSION_FACTORS.energy.electricity
  const acEmissions = acHours * EMISSION_FACTORS.energy.ac
  return parseFloat((electricityEmissions + acEmissions).toFixed(2))
}

export function calculateTreeEquivalent(emissionsKg: number): number {
  // A single mature tree absorbs roughly 20kg of CO2 per year
  // So we calculate the equivalent tree-years needed to offset the emissions
  return parseFloat((emissionsKg / 20).toFixed(2))
}

export function getSustainabilityRating(emissionsKg: number): { rating: string; color: string } {
  if (emissionsKg < 5) {
    return { rating: 'Low Impact (Excellent)', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' }
  } else if (emissionsKg <= 12) {
    return { rating: 'Moderate Impact (Average)', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
  } else {
    return { rating: 'High Impact (Alert)', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' }
  }
}
