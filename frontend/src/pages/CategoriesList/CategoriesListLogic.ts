import { useMemo } from "react";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getAllCategories } from "../../services/categoryService";
import { formatRecipeCount } from "../../utils/recipeFormat";
import type { CategoriesListLogic, CategoryItem } from "./CategoriesListTypes";

export const useCategoriesListLogic = (): CategoriesListLogic => {
  const { data, error, isLoading, reload } = useAsyncData(getAllCategories);

  const categories = useMemo<CategoryItem[]>(
    () =>
      (data ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        href: `/categories/${category.slug}`,
        // Never show a made-up "0 recipes" when the count is missing.
        countLabel:
          typeof category.count === "number" ? formatRecipeCount(category.count) : null,
      })),
    [data],
  );

  return {
    state: {
      categories,
      isLoading,
      errorMessage: error ? "We couldn't load the categories. Please try again." : null,
      isEmpty: !isLoading && !error && categories.length === 0,
    },
    actions: { retry: reload },
  };
};
