import { type Recipe } from "../models/Recipe";
import { apiClient } from "./apiClient";

export const getAllRecipes = async (category?: string): Promise<Recipe[]> => {
  const endpoint = category ? `/recipes?category=${category}` : "/recipes";
  return apiClient<Recipe[]>(endpoint);
};


export const getRecipeBySlug = async (slug: string): Promise<Recipe> => {
  return apiClient<Recipe>(`/recipes/${slug}`);
};

export const createRecipe = async (recipeData: Partial<Recipe>): Promise<Recipe> => {
  return apiClient<Recipe>("/recipes", {
    method: "POST",
    body: recipeData,
  });
};

export const updateRecipe = async (slug: string, recipeData: Partial<Recipe>): Promise<Recipe> => {
  return apiClient<Recipe>(`/recipes/${slug}`, {
    method: "PUT",
    body: recipeData,
  });
};

export const deleteRecipe = async (slug: string): Promise<void> => {
  return apiClient(`/recipes/${slug}`, {
    method: "DELETE",
  });
};
