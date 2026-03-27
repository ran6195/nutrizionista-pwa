import { MealType } from "./types";

const FEEDBACK_KEY = "meal-feedback";
const HISTORY_KEY = "meal-history";

// Quanti giorni di storia passare a Claude
const HISTORY_DAYS = 14;

export interface MealFeedback {
  nome: string;
  mealType: MealType;
  status: "mangiato" | "rifiutato";
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface MealHistoryEntry {
  nome: string;
  mealType: MealType;
  date: string;
  timestamp: number;
}

// ── Feedback (mangiato / rifiutato) ────────────────────────────────────────

function loadFeedback(): MealFeedback[] {
  const raw = localStorage.getItem(FEEDBACK_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveFeedback(feedback: MealFeedback[]): void {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
}

export function recordFeedback(
  nome: string,
  mealType: MealType,
  status: "mangiato" | "rifiutato"
): void {
  const feedback = loadFeedback();
  feedback.push({
    nome,
    mealType,
    status,
    date: new Date().toISOString().slice(0, 10),
    timestamp: Date.now(),
  });
  saveFeedback(feedback);
}

// ── Storia suggerimenti (per evitare ripetizioni) ──────────────────────────

function loadHistory(): MealHistoryEntry[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function recordSuggestion(nome: string, mealType: MealType): void {
  const history = loadHistory();
  history.push({
    nome,
    mealType,
    date: new Date().toISOString().slice(0, 10),
    timestamp: Date.now(),
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ── Dati da passare all'API ────────────────────────────────────────────────

export interface PreferenceContext {
  recentMeals: string[];        // nomi pasti ultimi N giorni (da evitare)
  disliked: string[];           // pasti rifiutati spesso
  liked: string[];              // pasti mangiati spesso
}

export function buildPreferenceContext(mealType: MealType): PreferenceContext {
  const cutoff = Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000;

  const history = loadHistory()
    .filter((h) => h.mealType === mealType && h.timestamp > cutoff)
    .map((h) => h.nome);

  const feedback = loadFeedback().filter((f) => f.mealType === mealType);

  // Conta quante volte ogni pasto è stato rifiutato/mangiato
  const counts: Record<string, { rifiutato: number; mangiato: number }> = {};
  for (const f of feedback) {
    if (!counts[f.nome]) counts[f.nome] = { rifiutato: 0, mangiato: 0 };
    counts[f.nome][f.status]++;
  }

  const disliked = Object.entries(counts)
    .filter(([, v]) => v.rifiutato > v.mangiato)
    .sort(([, a], [, b]) => b.rifiutato - a.rifiutato)
    .map(([nome]) => nome);

  const liked = Object.entries(counts)
    .filter(([, v]) => v.mangiato > 0 && v.rifiutato === 0)
    .map(([nome]) => nome);

  return {
    recentMeals: [...new Set(history)],
    disliked,
    liked,
  };
}

// ── Stile casuale (iniettato nel prompt per variare i suggerimenti) ─────────

const STYLES = [
  "classico italiano semplice",
  "mediterraneo leggero",
  "proteico e saziante",
  "veloce da preparare (meno di 15 minuti)",
  "fresco e crudo (insalate, carpacci)",
  "caldo e confortante",
  "ispirazione greca o turca",
  "piatto unico completo",
  "a base di legumi",
  "ricco di verdure di stagione",
];

export function randomStyle(): string {
  return STYLES[Math.floor(Math.random() * STYLES.length)];
}
