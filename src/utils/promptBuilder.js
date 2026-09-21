// ============================================================
// promptBuilder.js — Build the Gemini prompt
// ============================================================

export function buildFitnessPrompt(data) {
  const {
    name,
    age,
    gender,
    height,
    weight,
    goal,
    diet,
    activity,
    restrictions,
  } = data;

  // Compute BMI for context
  const heightM = Number(height) / 100;
  const bmi = heightM > 0 ? (Number(weight) / (heightM * heightM)).toFixed(1) : '—';

  // Human-readable labels
  const goalMap = {
    'lose-weight': 'lose weight (fat loss while preserving muscle)',
    'gain-weight': 'gain weight (healthy mass)',
    'muscle-gain': 'build lean muscle',
    maintain: 'maintain current physique and general fitness',
  };
  const dietMap = {
    'no-preference': 'no specific dietary preference',
    vegetarian: 'vegetarian (no meat, no fish, no eggs)',
    'non-vegetarian': 'non-vegetarian (no restrictions)',
    vegan: 'vegan (no animal products at all)',
    eggetarian: 'eggetarian (vegetarian plus eggs)',
  };
  const activityMap = {
    sedentary: 'sedentary (little or no exercise)',
    light: 'lightly active (1–2 days a week)',
    moderate: 'moderately active (3–4 days a week)',
    active: 'very active (5–6 days a week)',
    'very-active': 'extremely active (daily intense training)',
  };
  const genderMap = {
    male: 'male',
    female: 'female',
    other: 'non-binary',
    'prefer-not-to-say': 'unspecified',
  };

  const goalLabel = goalMap[goal] || 'improve general fitness';
  const dietLabel = dietMap[diet] || 'no specific diet';
  const activityLabel = activityMap[activity] || 'moderately active';
  const genderLabel = genderMap[gender] || 'unspecified';

  // ------------------------------------------------------------
  // The Prompt
  // ------------------------------------------------------------
  return `You are a certified personal trainer and sports nutritionist with 15+ years of experience.

Create a personalized 7-day diet plan and a 5-day workout plan for the following user:

USER PROFILE
- Name: ${name}
- Age: ${age} years
- Gender: ${genderLabel}
- Height: ${height} cm
- Weight: ${weight} kg
- BMI: ${bmi}
- Goal: ${goalLabel}
- Diet preference: ${dietLabel}
- Activity level: ${activityLabel}
- Restrictions / notes: ${restrictions?.trim() || 'None'}

REQUIREMENTS
1. Diet plan: Provide 5 meals per day (Breakfast, Mid-morning Snack, Lunch, Evening Snack, Dinner) for each day, OR a single daily template repeated with variations. Aim for realistic Indian-friendly options when diet allows, but keep them flexible.
2. Include a daily calorie target and a macro breakdown (protein, carbs, fats in grams).
3. Workout plan: 5 training days + 2 rest or active-recovery days, spread across the week (Mon–Sun). Each training day must have a focus (e.g. "Chest & Triceps") and 4–6 exercises with sets and reps.
4. All exercises must be suitable for the user's goal, activity level, and any restrictions.
5. Include a short list of general tips (hydration, sleep, consistency) — 3 to 5 bullets max.
6. Keep the tone encouraging and practical. Avoid medical claims.

OUTPUT FORMAT — STRICT JSON ONLY
Return a single JSON object with EXACTLY this shape:

{
  "summary": "One short paragraph (2–3 sentences) describing the overall plan and rationale, addressed to ${name}.",
  "diet": {
    "dailyCalories": 2400,
    "macros": {
      "protein": 150,
      "carbs": 260,
      "fats": 70
    },
    "meals": [
      {
        "time": "Breakfast",
        "items": ["item 1", "item 2", "item 3"],
        "calories": 600
      },
      {
        "time": "Mid-morning Snack",
        "items": ["..."],
        "calories": 300
      },
      {
        "time": "Lunch",
        "items": ["..."],
        "calories": 700
      },
      {
        "time": "Evening Snack",
        "items": ["..."],
        "calories": 300
      },
      {
        "time": "Dinner",
        "items": ["..."],
        "calories": 500
      }
    ]
  },
  "workout": {
    "split": "Short description of the training split (e.g. 'Push / Pull / Legs with two accessory days').",
    "days": [
      {
        "day": "Monday",
        "focus": "Chest & Triceps",
        "exercises": [
          { "name": "Bench Press", "sets": 4, "reps": "8–10" },
          { "name": "Incline Dumbbell Press", "sets": 3, "reps": "10–12" }
        ]
      }
    ]
  },
  "tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}

IMPORTANT
- Output ONLY the JSON. No markdown, no commentary, no code fences.
- Use realistic numbers (calories, macros, sets, reps).
- All string values must be plain text (no emojis).
- If any field is not applicable, use an empty array or a short placeholder string — do not omit keys.`;
}