export type MealType = "colazione" | "spuntino_mattina" | "pranzo" | "spuntino_pomeriggio" | "cena";

export interface MealSuggestion {
  nome: string;
  descrizione: string;
  ingredienti: string[];
  preparazione: string;
  note_nutrizionali: string;
  calorie: number;
  proteine: number;   // grammi
  carboidrati: number; // grammi
  grassi: number;     // grammi
}

export type MealRating = "liked" | "disliked";

export interface StoredMeal {
  id: string;
  date: string;        // YYYY-MM-DD
  mealType: MealType;
  suggestion: MealSuggestion;
  timestamp: number;
  completed: boolean;
  rating?: MealRating;
}

export const MEAL_LABELS: Record<MealType, string> = {
  colazione:           "Colazione",
  spuntino_mattina:    "Spuntino mattina",
  pranzo:              "Pranzo",
  spuntino_pomeriggio: "Spuntino pomeriggio",
  cena:                "Cena",
};

export const MEAL_TIMES: Record<MealType, string> = {
  colazione:           "07:30",
  spuntino_mattina:    "10:00",
  pranzo:              "13:00",
  spuntino_pomeriggio: "16:30",
  cena:                "20:00",
};

export const MEAL_ICONS: Record<MealType, string> = {
  colazione:           "☀️",
  spuntino_mattina:    "🍎",
  pranzo:              "🌿",
  spuntino_pomeriggio: "🍊",
  cena:                "🌙",
};

// Target calorico giornaliero (personalizzabile)
export const DAILY_CALORIE_TARGET = 2100;
