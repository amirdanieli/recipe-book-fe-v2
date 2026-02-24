import type { Ingredient } from "./Ingredient";

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
    difficulty: "EASY" | "MEDIUM" | "HARD";
    categoryId: string;
    imageUrl?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}