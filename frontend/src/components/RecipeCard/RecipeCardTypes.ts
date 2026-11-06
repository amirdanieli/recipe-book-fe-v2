import type { Difficulty, Recipe } from "../../models/Recipe";

export interface RecipeCardProps {
  recipe: Recipe;
}

export interface RecipeCardState {
  title: string;
  href: string;
  story: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  prepTime: string;
  cookTime: string;
  /** Undefined when the recipe has no image or the image failed to load. */
  imageUrl: string | undefined;
}

export interface RecipeCardActions {
  handleImageError: () => void;
}

export interface RecipeCardLogic {
  state: RecipeCardState;
  actions: RecipeCardActions;
}
