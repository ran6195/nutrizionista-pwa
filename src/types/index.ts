export interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
  date: string
  category: 'colazione' | 'pranzo' | 'cena' | 'spuntino'
}

export interface UserProfile {
  name: string
  age: number
  weight: number
  height: number
  goal: 'perdere_peso' | 'mantenere_peso' | 'aumentare_massa'
  activityLevel: 'sedentario' | 'leggero' | 'moderato' | 'attivo' | 'molto_attivo'
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
}

export interface AiSuggestion {
  id: string
  category: 'dieta' | 'alimento' | 'abitudine' | 'motivazione'
  title: string
  description: string
  icon: string
}

export interface NutritionistTip {
  id: string
  title: string
  content: string
  author: string
  category: string
  icon: string
}
