import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

// Fallback rules-based recommendation engine
function generateRulesBasedRecommendations(activities: any[]): Array<{ title: string; description: string; savings: number; difficulty: 'Easy' | 'Medium' | 'Hard' }> {
  const recommendations: Array<{ title: string; description: string; savings: number; difficulty: 'Easy' | 'Medium' | 'Hard' }> = []

  // Count categories
  let carTrips = 0
  let carDistance = 0
  let meatMeals = 0
  let highAcHours = 0

  activities.forEach((act) => {
    if (act.category === 'transportation') {
      if (act.details?.type === 'car') {
        carTrips++
        carDistance += parseFloat(act.details.distance) || 0
      }
    } else if (act.category === 'food') {
      if (act.details?.type === 'meat') {
        meatMeals++
      }
    } else if (act.category === 'energy') {
      if (parseFloat(act.details?.acHours) > 4) {
        highAcHours++
      }
    }
  })

  // Rule 1: Car usage
  if (carDistance > 30 || carTrips >= 2) {
    recommendations.push({
      title: 'Swap Solo Car Drives for Public Transit',
      description: `You logged ${carDistance.toFixed(1)} km in car travel. Swapping 2 car trips per week for bus or train saves fuel and reduces street congestion.`,
      savings: 30,
      difficulty: 'Medium'
    })
  }

  // Rule 2: Meat diet
  if (meatMeals >= 2 || activities.length === 0) {
    recommendations.push({
      title: 'Embrace "Meatless Mondays"',
      description: 'Reducing meat consumption just one day a week significantly decreases greenhouse emissions associated with cattle ranching and livestock shipping.',
      savings: 15,
      difficulty: 'Easy'
    })
  }

  // Rule 3: AC usage
  if (highAcHours >= 1) {
    recommendations.push({
      title: 'Optimize Air Conditioner Temperature',
      description: 'Setting your AC to 25°C (77°F) instead of lower cooling settings saves up to 10% on energy bills and cuts grid electricity strain.',
      savings: 12,
      difficulty: 'Easy'
    })
  }

  // Fill up if we need 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Switch to energy-saving LED Bulbs',
      description: 'Replace incandescent or halogen lights with Energy Star rated LED alternatives. LEDs emit 90% less heat and last 25 times longer.',
      savings: 8,
      difficulty: 'Easy'
    })
  }
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Wash Laundry in Cold Water',
      description: 'About 75% to 90% of all energy your washing machine uses goes toward heating the water. Cold washes preserve clothes and save electricity.',
      savings: 5,
      difficulty: 'Easy'
    })
  }

  return recommendations.slice(0, 3)
}

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Check for cached uncompleted recommendations (valid for 3 days)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const { data: cachedRecs, error: cachedError } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false)
      .gt('created_at', threeDaysAgo.toISOString())

    if (!cachedError && cachedRecs && cachedRecs.length >= 3) {
      return NextResponse.json(cachedRecs)
    }

    // 3. Fetch user's recent activities for analysis (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .gt('date', thirtyDaysAgo.toISOString().split('T')[0])

    const recentActivities = activities || []

    // 4. Generate recommendations (OpenAI vs Fallback)
    const openAiKey = process.env.OPENAI_API_KEY
    let finalRecs: Array<{ title: string; description: string; savings: number; difficulty: 'Easy' | 'Medium' | 'Hard' }> = []

    if (openAiKey && !openAiKey.startsWith('placeholder') && openAiKey.length > 20) {
      try {
        const openai = new OpenAI({ apiKey: openAiKey })
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a sustainability and climate copilot. Based on the user\'s weekly habits, generate 3 highly specific, actionable, and practical recommendations. Return JSON array format ONLY. Each recommendation object must have exactly: title (string), description (string), savings (number representing monthly kg CO2e savings), and difficulty (string: "Easy", "Medium", or "Hard"). Do not output any markdown code blocks, just raw JSON.'
            },
            {
              role: 'user',
              content: `Here are my carbon footprint activities for the past 30 days: ${JSON.stringify(recentActivities)}. Provide 3 personalized ways I can reduce my emissions.`
            }
          ],
          response_format: { type: 'json_object' }
        })

        const content = response.choices[0]?.message?.content
        if (content) {
          const parsed = JSON.parse(content)
          // Look for array within parsed object (e.g. { recommendations: [...] } or direct array)
          const array = Array.isArray(parsed) ? parsed : parsed.recommendations || Object.values(parsed)[0]
          if (Array.isArray(array)) {
            finalRecs = array.slice(0, 3).map((r: any) => ({
              title: String(r.title || ''),
              description: String(r.description || ''),
              savings: parseFloat(r.savings) || 10,
              difficulty: ['Easy', 'Medium', 'Hard'].includes(r.difficulty) ? r.difficulty : 'Easy'
            }))
          }
        }
      } catch (err) {
        console.error('OpenAI generation failed, falling back to rules-based:', err)
        finalRecs = generateRulesBasedRecommendations(recentActivities)
      }
    } else {
      console.log('No OpenAI API key configured, generating rules-based recommendations')
      finalRecs = generateRulesBasedRecommendations(recentActivities)
    }

    // Double check we have exactly 3
    if (finalRecs.length < 3) {
      finalRecs = generateRulesBasedRecommendations(recentActivities)
    }

    // 5. Clean up old uncompleted recommendations to avoid clutter
    await supabase
      .from('recommendations')
      .delete()
      .eq('user_id', user.id)
      .eq('completed', false)

    // 6. Save new recommendations to DB
    const dbPayload = finalRecs.map((rec) => ({
      user_id: user.id,
      title: rec.title,
      description: rec.description,
      savings: rec.savings,
      difficulty: rec.difficulty,
      completed: false,
    }))

    const { data: insertedRecs, error: insertError } = await supabase
      .from('recommendations')
      .insert(dbPayload)
      .select()

    if (insertError) {
      console.error('Failed to save recommendations to DB:', insertError)
      // Return generated recs without IDs if insert fails
      return NextResponse.json(finalRecs.map((r, i) => ({ id: `temp-${i}`, ...r, completed: false })))
    }

    return NextResponse.json(insertedRecs)
  } catch (err: any) {
    console.error('Recommendations route error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { recommendationId, completed } = await request.json()
    if (!recommendationId) {
      return NextResponse.json({ error: 'Missing recommendationId' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('recommendations')
      .update({
        completed: !!completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq('id', recommendationId)
      .eq('user_id', user.id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
