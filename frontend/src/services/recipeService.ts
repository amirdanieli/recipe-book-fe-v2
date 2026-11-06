import type { Recipe, RecipeInput } from "../models/Recipe";
import { apiClient } from "./apiClient";

/** @param category optional category slug or id to filter by */
export const getAllRecipes = (category?: string): Promise<Recipe[]> => {
  const query = category ? `?${new URLSearchParams({ category })}` : "";
  return apiClient<Recipe[]>(`/recipes${query}`);
};

export const getRecipeBySlug = (slug: string): Promise<Recipe> =>
  apiClient<Recipe>(`/recipes/${encodeURIComponent(slug)}`);

export const createRecipe = (data: RecipeInput): Promise<Recipe> =>
  apiClient<Recipe>("/recipes", { method: "POST", body: data });

export const updateRecipe = (slug: string, data: Partial<RecipeInput>): Promise<Recipe> =>
  apiClient<Recipe>(`/recipes/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: data,
  });

export const deleteRecipe = (slug: string): Promise<void> =>
  apiClient<void>(`/recipes/${encodeURIComponent(slug)}`, { method: "DELETE" });
