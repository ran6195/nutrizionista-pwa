import { StoredMeal, MealType, MealSuggestion, MealRating } from "./types";

const storageKey = (date: string) => `meals-${date}`;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function saveMeal(mealType: MealType, suggestion: MealSuggestion): StoredMeal {
  const date = todayKey();
  const meals = loadMeals(date);

  const newMeal: StoredMeal = {
    id: `${date}-${mealType}-${Date.now()}`,
    date,
    mealType,
    suggestion,
    timestamp: Date.now(),
    completed: false,
  };

  // Sostituisce un eventuale pasto dello stesso tipo già salvato oggi
  const filtered = meals.filter((m) => m.mealType !== mealType);
  const updated = [...filtered, newMeal];

  localStorage.setItem(storageKey(date), JSON.stringify(updated));
  return newMeal;
}

export function loadMeals(date?: string): StoredMeal[] {
  const key = storageKey(date ?? todayKey());
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredMeal[];
  } catch {
    return [];
  }
}

export function toggleMealCompleted(id: string): void {
  const date = todayKey();
  const meals = loadMeals(date);
  const updated = meals.map((m) =>
    m.id === id ? { ...m, completed: !m.completed } : m
  );
  localStorage.setItem(storageKey(date), JSON.stringify(updated));
}

export function deleteMeal(id: string): void {
  const date = todayKey();
  const meals = loadMeals(date);
  const updated = meals.filter((m) => m.id !== id);
  localStorage.setItem(storageKey(date), JSON.stringify(updated));
}

export function setMealRating(id: string, rating: MealRating | undefined): void {
  const date = todayKey();
  const meals = loadMeals(date);
  const updated = meals.map((m) =>
    m.id === id ? { ...m, rating } : m
  );
  localStorage.setItem(storageKey(date), JSON.stringify(updated));
}

export function todayCalories(meals: StoredMeal[]): number {
  return meals.reduce((sum, m) => sum + (m.suggestion.calorie ?? 0), 0);
}
