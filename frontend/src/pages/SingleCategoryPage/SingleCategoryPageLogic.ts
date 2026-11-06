import { useCallback } from "react";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuth } from "../../hooks/useAuth";
import { isNotFoundError } from "../../services/apiClient";
import { getCategoryByIdOrSlug } from "../../services/categoryService";
import { getAllRecipes } from "../../services/recipeService";
import type { SingleCategoryPageLogic } from "./SingleCategoryPageTypes";

export const useSingleCategoryPageLogic = (
  slug: string | undefined,
): SingleCategoryPageLogic => {
  const { state: auth } = useAuth();

  const fetchCategoryPage = useCallback(
    async () => {
      if (!slug) throw new Error("Missing category slug");
      const [category, recipes] = await Promise.all([
        getCategoryByIdOrSlug(slug),
        getAllRecipes(slug),
      ]);
      return { category, recipes };
    },
    [slug],
  );

  const { data, error, isLoading, reload } = useAsyncData(slug ? fetchCategoryPage : null);

  const recipes = data?.recipes ?? [];
  const isNotFound = !slug || isNotFoundError(error);

  return {
    state: {
      categoryName: data?.category.name ?? "",
      recipes,
      isLoading,
      isNotFound,
      errorMessage:
        error && !isNotFound ? "We couldn't load this category. Please try again." : null,
      isEmpty: Boolean(data) && recipes.length === 0,
      canAddRecipe: auth.isAdmin,
    },
    actions: { retry: reload },
  };
};
