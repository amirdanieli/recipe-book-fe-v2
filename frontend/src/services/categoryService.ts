import type { Category } from "../models/Category";
import { apiClient } from "./apiClient";

export const getAllCategories = async (): Promise<Category[]> => {
  return apiClient<Category[]>("/categories");
};

export const getCategoryByIdOrSlug = async (idOrSlug: string): Promise<Category> => {
  return apiClient<Category>(`/categories/${idOrSlug}`);
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  return apiClient<Category>("/categories", {
    method: "POST",
    body: categoryData,
  });
};

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  return apiClient<Category>(`/categories/${id}`, {
    method: "PUT",
    body: categoryData,
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  return apiClient(`/categories/${id}`, {
    method: "DELETE",
  });
};
