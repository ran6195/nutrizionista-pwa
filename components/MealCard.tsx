"use client";

import { useState } from "react";
import { MealSuggestion, MealRating } from "@/lib/types";
import ThumbsRating from "./ThumbsRating";

interface MealCardProps {
  suggestion: MealSuggestion;
  initialRating?: MealRating;
  onRate?: (rating: MealRating | undefined) => void;
}

const MACROS = [
  { key: "calorie" as const,     label: "Kcal",    color: "var(--color-primary)" },
  { key: "proteine" as const,    label: "Proteine", color: "var(--color-tertiary)" },
  { key: "carboidrati" as const, label: "Carb",     color: "var(--color-secondary)" },
  { key: "grassi" as const,      label: "Grassi",   color: "var(--color-outline)" },
];

export default function MealCard({ suggestion, initialRating, onRate }: MealCardProps) {
  const [rating, setRating] = useState<MealRating | undefined>(initialRating);

  const handleRate = (r: MealRating | undefined) => {
    setRating(r);
    onRate?.(r);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(157,62,29,0.08)" }}
    >
      {/* Header terracotta */}
      <div
        className="px-6 py-5"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-label)" }}
            >
              Il tuo pasto
            </p>
            <h2
              className="text-2xl font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-primary)" }}
            >
              {suggestion.nome}
            </h2>
          </div>
          <div className="flex-shrink-0 pt-1">
            <ThumbsRating value={rating} onChange={handleRate} />
          </div>
        </div>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-body)" }}
        >
          {suggestion.descrizione}
        </p>
      </div>

      {/* Macronutrienti */}
      <div
        className="grid grid-cols-4 divide-x"
        style={{
          backgroundColor: "var(--color-surface-container-low)",
          borderColor: "var(--color-surface-container-high)",
        }}
      >
        {MACROS.map(({ key, label, color }) => (
          <div key={key} className="py-3 text-center">
            <p
              className="text-lg font-extrabold"
              style={{ fontFamily: "var(--font-headline)", color }}
            >
              {suggestion[key] ?? "—"}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="px-6 py-6 space-y-6"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        {/* Ingredienti */}
        <section>
          <h3
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)" }}
          >
            Ingredienti
          </h3>
          <ul className="space-y-2">
            {suggestion.ingredienti.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--color-tertiary)" }}
                />
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-on-surface)", fontFamily: "var(--font-body)" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="h-px" style={{ backgroundColor: "var(--color-surface-container-high)" }} />

        {/* Preparazione */}
        <section>
          <h3
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)" }}
          >
            Preparazione
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-on-surface)", fontFamily: "var(--font-body)" }}
          >
            {suggestion.preparazione}
          </p>
        </section>

        {/* Nota nutrizionale */}
        <div
          className="rounded-xl px-4 py-4"
          style={{ backgroundColor: "var(--color-surface-container-low)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--color-tertiary)", fontFamily: "var(--font-label)" }}
          >
            Nota del nutrizionista
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}
          >
            {suggestion.note_nutrizionali}
          </p>
        </div>
      </div>
    </div>
  );
}
