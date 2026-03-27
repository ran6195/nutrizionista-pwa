"use client";

import { MealRating } from "@/lib/types";

interface ThumbsRatingProps {
  value?: MealRating;
  onChange: (rating: MealRating | undefined) => void;
  size?: "sm" | "md";
}

export default function ThumbsRating({ value, onChange, size = "md" }: ThumbsRatingProps) {
  const dim = size === "sm" ? "w-8 h-8 text-base" : "w-10 h-10 text-xl";

  const handleClick = (clicked: MealRating) => {
    // Secondo click sullo stesso bottone → rimuove il voto
    onChange(value === clicked ? undefined : clicked);
  };

  return (
    <div className="flex gap-2">
      {/* Pollice su */}
      <button
        type="button"
        onClick={() => handleClick("liked")}
        className={`${dim} rounded-full flex items-center justify-center transition-all duration-200`}
        style={{
          backgroundColor:
            value === "liked"
              ? "var(--color-tertiary)"
              : "var(--color-surface-container)",
          color: value === "liked" ? "#fff" : "var(--color-on-surface-variant)",
          transform: value === "liked" ? "scale(1.1)" : "scale(1)",
        }}
        title="Mi piace"
        aria-pressed={value === "liked"}
      >
        👍
      </button>

      {/* Pollice giù */}
      <button
        type="button"
        onClick={() => handleClick("disliked")}
        className={`${dim} rounded-full flex items-center justify-center transition-all duration-200`}
        style={{
          backgroundColor:
            value === "disliked"
              ? "var(--color-error)"
              : "var(--color-surface-container)",
          color: value === "disliked" ? "#fff" : "var(--color-on-surface-variant)",
          transform: value === "disliked" ? "scale(1.1)" : "scale(1)",
        }}
        title="Non mi piace"
        aria-pressed={value === "disliked"}
      >
        👎
      </button>
    </div>
  );
}
