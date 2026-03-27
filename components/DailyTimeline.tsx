"use client";

import { useState } from "react";
import { StoredMeal, MEAL_LABELS, MEAL_TIMES, MEAL_ICONS, DAILY_CALORIE_TARGET, MealType, MealRating } from "@/lib/types";
import { toggleMealCompleted, deleteMeal, todayCalories, setMealRating } from "@/lib/mealStorage";
import { recordFeedback } from "@/lib/preferenceStorage";
import ThumbsRating from "./ThumbsRating";

const MEAL_ORDER: MealType[] = ["colazione", "spuntino_mattina", "pranzo", "spuntino_pomeriggio", "cena"];

interface DailyTimelineProps {
  initialMeals: StoredMeal[];
}

export default function DailyTimeline({ initialMeals }: DailyTimelineProps) {
  const [meals, setMeals] = useState<StoredMeal[]>(initialMeals);

  const calories = todayCalories(meals);
  const progress = Math.min((calories / DAILY_CALORIE_TARGET) * 100, 100);

  const getMealForType = (type: MealType) =>
    meals.find((m) => m.mealType === type) ?? null;

  const handleToggle = (id: string) => {
    const meal = meals.find((m) => m.id === id);
    if (meal) {
      const nextCompleted = !meal.completed;
      recordFeedback(meal.suggestion.nome, meal.mealType, nextCompleted ? "mangiato" : "rifiutato");
    }
    toggleMealCompleted(id);
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleDelete = (id: string) => {
    const meal = meals.find((m) => m.id === id);
    if (meal && !meal.completed) {
      recordFeedback(meal.suggestion.nome, meal.mealType, "rifiutato");
    }
    deleteMeal(id);
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRate = (id: string, rating: MealRating | undefined) => {
    const meal = meals.find((m) => m.id === id);
    if (!meal) return;
    setMealRating(id, rating);
    if (rating) {
      recordFeedback(
        meal.suggestion.nome,
        meal.mealType,
        rating === "liked" ? "mangiato" : "rifiutato"
      );
    }
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, rating } : m)));
  };

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  function isPast(time: string): boolean {
    const [h, m] = time.split(":").map(Number);
    return currentHour > h + m / 60;
  }

  return (
    <div className="space-y-8">
      {/* Progress calorie */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        <div className="flex justify-between items-baseline mb-3">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)" }}
            >
              Calorie oggi
            </p>
            <p
              className="text-3xl font-extrabold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              {calories}
              <span
                className="text-base font-normal ml-1"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                / {DAILY_CALORIE_TARGET} kcal
              </span>
            </p>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}
          >
            {Math.round(progress)}%
          </p>
        </div>

        {/* Barra di progresso */}
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-container-high)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              backgroundColor:
                progress > 95
                  ? "var(--color-error)"
                  : progress > 75
                  ? "var(--color-primary)"
                  : "var(--color-tertiary)",
            }}
          />
        </div>

        {/* Macro totali */}
        {meals.length > 0 && (
          <div className="flex gap-4 mt-4">
            {(["proteine", "carboidrati", "grassi"] as const).map((macro) => {
              const total = meals.reduce((s, m) => s + (m.suggestion[macro] ?? 0), 0);
              const labels = { proteine: "Proteine", carboidrati: "Carb", grassi: "Grassi" };
              return (
                <div key={macro} className="text-center flex-1">
                  <p
                    className="text-base font-bold"
                    style={{ color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}
                  >
                    {total}g
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)" }}
                  >
                    {labels[macro]}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timeline pasti */}
      <div className="relative">
        {/* Linea verticale */}
        <div
          className="absolute left-6 top-0 bottom-0 w-px"
          style={{ backgroundColor: "var(--color-surface-container-high)" }}
        />

        <div className="space-y-4">
          {MEAL_ORDER.map((type) => {
            const meal = getMealForType(type);
            const time = MEAL_TIMES[type];
            const past = isPast(time);
            const isNow =
              currentHour >= parseFloat(time.replace(":", ".")) &&
              currentHour < parseFloat(time.replace(":", ".")) + 3;

            return (
              <div key={type} className="flex gap-4 items-start">
                {/* Dot sulla timeline */}
                <div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                  style={{
                    backgroundColor: meal?.completed
                      ? "var(--color-tertiary)"
                      : isNow
                      ? "var(--color-primary-fixed)"
                      : "var(--color-surface-container)",
                    outline: isNow ? "2px solid var(--color-primary)" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  {meal?.completed ? "✓" : MEAL_ICONS[type]}
                </div>

                {/* Contenuto */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)" }}
                    >
                      {time}
                    </p>
                    {isNow && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: "var(--color-primary-fixed)",
                          color: "var(--color-primary)",
                          fontFamily: "var(--font-label)",
                        }}
                      >
                        Ora
                      </span>
                    )}
                    {past && !isNow && !meal && (
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}
                      >
                        Saltato
                      </span>
                    )}
                  </div>

                  {meal ? (
                    <div
                      className="rounded-xl p-4"
                      style={{
                        backgroundColor: meal.completed
                          ? "var(--color-surface-container-low)"
                          : "var(--color-surface-container-lowest)",
                        boxShadow: meal.completed ? "none" : "0 2px 12px rgba(157,62,29,0.06)",
                        opacity: meal.completed ? 0.7 : 1,
                      }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p
                            className="font-bold text-sm leading-tight"
                            style={{
                              fontFamily: "var(--font-headline)",
                              color: "var(--color-on-surface)",
                              textDecoration: meal.completed ? "line-through" : "none",
                            }}
                          >
                            {meal.suggestion.nome}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}
                          >
                            {meal.suggestion.calorie} kcal · {meal.suggestion.proteine}g prot
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <ThumbsRating
                            size="sm"
                            value={meal.rating}
                            onChange={(r) => handleRate(meal.id, r)}
                          />
                          <button
                            onClick={() => handleToggle(meal.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                            style={{
                              backgroundColor: meal.completed
                                ? "var(--color-tertiary)"
                                : "var(--color-surface-container)",
                              color: meal.completed ? "#fff" : "var(--color-on-surface-variant)",
                            }}
                            title={meal.completed ? "Segna come da fare" : "Segna come mangiato"}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleDelete(meal.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                            style={{
                              backgroundColor: "var(--color-surface-container)",
                              color: "var(--color-on-surface-variant)",
                            }}
                            title="Rimuovi"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="rounded-xl px-4 py-3"
                      style={{ backgroundColor: "var(--color-surface-container-low)" }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--color-on-surface)", fontFamily: "var(--font-headline)" }}
                      >
                        {MEAL_LABELS[type]}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--color-outline)", fontFamily: "var(--font-body)" }}
                      >
                        Nessun suggerimento ancora
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
