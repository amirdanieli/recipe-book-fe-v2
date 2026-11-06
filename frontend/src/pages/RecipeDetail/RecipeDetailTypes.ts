import type { Difficulty, Recipe } from "../../models/Recipe";

export interface RecipeMetaItem {
  label: string;
  value: string;
}

export interface RecipeDetailState {
  recipe: Recipe | null;
  /** Title without formatting tags (alt text, dialogs). */
  plainTitle: string;
  isLoading: boolean;
  isNotFound: boolean;
  errorMessage: string | null;
  isAdmin: boolean;
  isDeleting: boolean;
  difficulty: Difficulty | null;
  difficultyLabel: string;
  /** Prep / cook / total time, ready to display. */
  meta: RecipeMetaItem[];
  /** Undefined when there is no image or it failed to load. */
  imageUrl: string | undefined;
  /** Category page of this recipe, or the category list as a fallback. */
  backHref: string;
  backLabel: string;
  editHref: string;
  toastMessage: string;
}

export interface RecipeDetailActions {
  deleteRecipe: () => Promise<void>;
  retry: () => void;
  handleImageError: () => void;
  dismissToast: () => void;
}

export interface RecipeDetailLogic {
  state: RecipeDetailState;
  actions: RecipeDetailActions;
}
