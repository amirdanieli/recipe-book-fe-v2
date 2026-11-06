import type { Difficulty } from "../models/Recipe";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

/** 45 -> "45 min", 90 -> "1 h 30 min", 120 -> "2 h" */
export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
};

/** 1 -> "1 recipe", 3 -> "3 recipes" */
export const formatRecipeCount = (count = 0): string =>
  `${count} ${count === 1 ? "recipe" : "recipes"}`;
