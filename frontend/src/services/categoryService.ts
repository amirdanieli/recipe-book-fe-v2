import type { Category } from "../models/Category";
import { apiClient } from "./apiClient";

export const getAllCategories = (): Promise<Category[]> =>
  apiClient<Category[]>("/categories");

export const getCategoryByIdOrSlug = (idOrSlug: string): Promise<Category> =>
  apiClient<Category>(`/categories/${encodeURIComponent(idOrSlug)}`);

export const createCategory = (data: Pick<Category, "name">): Promise<Category> =>
  apiClient<Category>("/categories", { method: "POST", body: data });

export const updateCategory = (
  id: string,
  data: Partial<Pick<Category, "name">>,
): Promise<Category> =>
  apiClient<Category>(`/categories/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: data,
  });

export const deleteCategory = (id: string): Promise<void> =>
  apiClient<void>(`/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
