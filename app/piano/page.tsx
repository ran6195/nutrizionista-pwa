"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DailyTimeline from "@/components/DailyTimeline";
import { StoredMeal } from "@/lib/types";
import { loadMeals } from "@/lib/mealStorage";

export default function PianoPage() {
  const [meals, setMeals] = useState<StoredMeal[]>([]);

  useEffect(() => {
    setMeals(loadMeals());
  }, []);

  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div className="space-y-1">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
            >
              Piano giornaliero
            </p>
            <h1
              className="text-3xl font-extrabold capitalize"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              {today}
            </h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              fontFamily: "var(--font-label)",
            }}
          >
            + Suggerisci
          </Link>
        </header>

        {meals.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
          >
            <p className="text-3xl mb-3">🌿</p>
            <p
              className="font-bold text-base mb-1"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              Nessun pasto ancora
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}
            >
              Vai alla home per ricevere il tuo primo suggerimento.
            </p>
          </div>
        ) : (
          <DailyTimeline initialMeals={meals} />
        )}
      </div>
    </main>
  );
}
