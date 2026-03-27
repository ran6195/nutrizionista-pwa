"use client";

import { useState } from "react";
import { MealType } from "@/lib/types";

export type { MealType };

interface MealFormProps {
  onSubmit: (mealType: MealType, notes: string) => void;
  loading: boolean;
}

const MEAL_OPTIONS: { value: MealType; label: string; icon: string; time: string }[] = [
  { value: "colazione",           label: "Colazione",          icon: "☀️", time: "07:00 – 09:00" },
  { value: "spuntino_mattina",    label: "Spuntino mattina",   icon: "🍎", time: "10:00 – 11:00" },
  { value: "pranzo",              label: "Pranzo",             icon: "🌿", time: "12:30 – 13:30" },
  { value: "spuntino_pomeriggio", label: "Spuntino pomeriggio",icon: "🍊", time: "16:00 – 17:00" },
  { value: "cena",                label: "Cena",               icon: "🌙", time: "19:00 – 20:30" },
];

export default function MealForm({ onSubmit, loading }: MealFormProps) {
  const [selected, setSelected] = useState<MealType | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    onSubmit(selected, notes);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Selezione tipo pasto */}
      <div>
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}
        >
          Che pasto stai cercando?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {MEAL_OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className="flex flex-col items-start p-4 rounded-xl transition-all duration-200 text-left"
                style={{
                  backgroundColor: isSelected
                    ? "var(--color-primary-fixed)"
                    : "var(--color-surface-container-low)",
                  outline: isSelected ? "2px solid var(--color-primary)" : "none",
                  outlineOffset: "2px",
                }}
              >
                <span className="text-2xl mb-2">{opt.icon}</span>
                <span
                  className="font-bold text-base"
                  style={{
                    fontFamily: "var(--font-headline)",
                    color: isSelected ? "var(--color-primary)" : "var(--color-on-surface)",
                  }}
                >
                  {opt.label}
                </span>
                <span
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  {opt.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note aggiuntive */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-semibold uppercase tracking-widest mb-2"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}
        >
          Note del giorno <span className="normal-case font-normal">(facoltativo)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Es. ho poco tempo, voglio qualcosa di leggero, ho già mangiato pasta a pranzo…"
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-colors duration-200 focus:outline-none"
          style={{
            backgroundColor: "var(--color-surface-container-high)",
            color: "var(--color-on-surface)",
            fontFamily: "var(--font-body)",
          }}
          onFocus={(e) => {
            e.target.style.backgroundColor = "var(--color-surface-container-lowest)";
            e.target.style.boxShadow = "0 0 0 2px rgba(160,64,31,0.3)";
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = "var(--color-surface-container-high)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Bottone submit */}
      <button
        type="submit"
        disabled={!selected || loading}
        className="w-full py-4 rounded-full font-bold text-base transition-opacity duration-200 disabled:opacity-40"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
          color: "var(--color-on-primary)",
          fontFamily: "var(--font-headline)",
        }}
      >
        {loading ? "Sto preparando il suggerimento…" : "Suggeriscimi un pasto"}
      </button>
    </form>
  );
}
