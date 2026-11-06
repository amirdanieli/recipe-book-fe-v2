import type { Recipe } from "../../models/Recipe";

export interface SingleCategoryPageState {
  categoryName: string;
  recipes: Recipe[];
  isLoading: boolean;
  isNotFound: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  /** Admins get an "Add a recipe" shortcut in the empty state. */
  canAddRecipe: boolean;
}

export interface SingleCategoryPageActions {
  retry: () => void;
}

export interface SingleCategoryPageLogic {
  state: SingleCategoryPageState;
  actions: SingleCategoryPageActions;
}
