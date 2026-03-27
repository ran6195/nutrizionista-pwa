"use client";

import { useState } from "react";
import Link from "next/link";
import MealForm, { MealType } from "@/components/MealForm";
import MealCard from "@/components/MealCard";
import { MealSuggestion, MealRating } from "@/lib/types";
import { saveMeal, setMealRating } from "@/lib/mealStorage";
import { buildPreferenceContext, randomStyle, recordSuggestion, recordFeedback } from "@/lib/preferenceStorage";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<MealSuggestion | null>(null);
  const [currentMealId, setCurrentMealId] = useState<string | null>(null);
  const [currentMealType, setCurrentMealType] = useState<MealType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (mealType: MealType, notes: string) => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    setSaved(false);

    // Costruisce il contesto preferenze e lo stile casuale lato client
    // (localStorage è accessibile solo nel browser)
    const preferences = buildPreferenceContext(mealType);
    const style = randomStyle();

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealType, notes, preferences, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Errore sconosciuto");
        return;
      }

      const stored = saveMeal(mealType, data.suggestion);
      recordSuggestion(data.suggestion.nome, mealType);
      setSuggestion(data.suggestion);
      setCurrentMealId(stored.id);
      setCurrentMealType(mealType);
      setSaved(true);
    } catch {
      setError("Impossibile contattare il server. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-lg mx-auto space-y-10">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
            >
              Harvest &amp; Hearth
            </p>
            <h1
              className="text-4xl font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              Cosa mangio<br />oggi?
            </h1>
            <p
              className="text-base"
              style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}
            >
              Suggerimenti personalizzati basati sul tuo piano nutrizionale.
            </p>
          </div>
          <Link
            href="/piano"
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors"
            style={{
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
            }}
          >
            <span className="text-xl">📋</span>
            <span
              className="text-xs font-semibold"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
            >
              Piano
            </span>
          </Link>
        </header>

        {/* Form */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
        >
          <MealForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Errore */}
        {error && (
          <div
            className="rounded-xl px-5 py-4 text-sm"
            style={{
              backgroundColor: "var(--color-error-container)",
              color: "var(--color-on-error-container)",
              fontFamily: "var(--font-body)",
            }}
          >
            {error}
          </div>
        )}

        {/* Risultato */}
        {suggestion && (
          <div className="space-y-3">
            {saved && (
              <div className="flex items-center justify-between">
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-tertiary)", fontFamily: "var(--font-label)" }}
                >
                  ✓ Salvato nel piano di oggi
                </p>
                <Link
                  href="/piano"
                  className="text-xs font-semibold underline"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
                >
                  Vedi piano →
                </Link>
              </div>
            )}
            <MealCard
              suggestion={suggestion}
              onRate={(rating: MealRating | undefined) => {
                if (!currentMealId || !currentMealType) return;
                setMealRating(currentMealId, rating);
                if (rating) {
                  recordFeedback(
                    suggestion.nome,
                    currentMealType,
                    rating === "liked" ? "mangiato" : "rifiutato"
                  );
                }
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
