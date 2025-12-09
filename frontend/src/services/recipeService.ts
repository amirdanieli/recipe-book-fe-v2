import { type Recipe } from "../models/Recipe";

const API_URL = "http://localhost:3000"; 

const getOptions = (method: string, body?: object) => ({
  method,
  credentials: "include" as RequestCredentials, 
  headers: {
    "Content-Type": "application/json",
  },
  body: body ? JSON.stringify(body) : undefined,
});

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(`${API_URL}/recipes`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
};

export const getRecipeBySlug = async (slug: string): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/recipes/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch recipe");
  return response.json();
};

export const createRecipe = async (recipeData: Partial<Recipe>) => {
  const response = await fetch(`${API_URL}/recipes`, getOptions("POST", recipeData));
  if (!response.ok) throw new Error("Failed to create recipe");
  return response.json();
};

export const updateRecipe = async (slug: string, recipeData: Partial<Recipe>) => {
  const response = await fetch(`${API_URL}/recipes/${slug}`, getOptions("PUT", recipeData));
  if (!response.ok) throw new Error("Failed to update recipe");
  return response.json();
};

export const deleteRecipe = async (slug: string) => {
  // DELETE usually has no body
  const response = await fetch(`${API_URL}/recipes/${slug}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to delete recipe");
  return true;
};