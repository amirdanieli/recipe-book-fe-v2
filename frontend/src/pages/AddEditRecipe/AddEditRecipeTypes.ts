import type { ChangeEvent, FormEvent } from "react";
import type { Category } from "../../models/Category";
import type { Difficulty } from "../../models/Recipe";
import type { Ingredient } from "../../models/Ingredient";

/** Ingredient row in the form; `key` is a client-only stable React key. */
export interface IngredientRow extends Ingredient {
  key: string;
}

export interface StepRow {
  key: string;
  text: string;
}

export interface RecipeFormValues {
  title: string;
  categoryId: string;
  difficulty: Difficulty | "";
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  story: string;
  ingredients: IngredientRow[];
  steps: StepRow[];
}

export type TextField = "title" | "categoryId" | "difficulty" | "story";
export type MinutesField = "prepTimeMinutes" | "cookTimeMinutes";

export type FieldErrors = Partial<
  Record<"title" | "categoryId" | "difficulty" | "ingredients" | "steps", string>
>;

export interface SelectOption {
  value: string;
  label: string;
}

export interface AddEditRecipeState {
  isEditMode: boolean;
  pageTitle: string;
  submitLabel: string;
  values: RecipeFormValues;
  categories: Category[];
  categoriesErrorMessage: string | null;
  difficultyOptions: SelectOption[];
  fieldErrors: FieldErrors;
  /** Preview of the newly picked file, or the recipe's current image. */
  imagePreviewUrl: string | null;
  isLoading: boolean;
  loadErrorMessage: string | null;
  isSubmitting: boolean;
  toastMessage: string;
}

export interface AddEditRecipeActions {
  setTextField: (field: TextField, value: string) => void;
  setMinutesField: (field: MinutesField, rawValue: string) => void;
  selectImage: (event: ChangeEvent<HTMLInputElement>) => void;
  addIngredient: () => void;
  updateIngredient: (key: string, field: keyof Ingredient, value: string) => void;
  removeIngredient: (key: string) => void;
  addStep: () => void;
  updateStep: (key: string, text: string) => void;
  removeStep: (key: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  cancel: () => void;
  dismissToast: () => void;
}

export interface AddEditRecipeLogic {
  state: AddEditRecipeState;
  actions: AddEditRecipeActions;
}
