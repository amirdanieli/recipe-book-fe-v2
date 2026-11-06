import type { Ingredient } from "./Ingredient";

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  story: string;
  ingredients: Ingredient[];
  steps: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  prepTimeNote?: string;
  difficulty: Difficulty;
  categoryId: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload accepted by POST /recipes and PUT /recipes/:slug. */
export type RecipeInput = Pick<
  Recipe,
  | "title"
  | "categoryId"
  | "difficulty"
  | "prepTimeMinutes"
  | "cookTimeMinutes"
  | "story"
  | "ingredients"
  | "steps"
> & {
  imageUrl?: string;
  prepTimeNote?: string;
};
