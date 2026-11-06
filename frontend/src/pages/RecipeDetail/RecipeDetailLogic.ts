import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage, isNotFoundError } from "../../services/apiClient";
import { getAllCategories } from "../../services/categoryService";
import { deleteRecipe as apiDeleteRecipe, getRecipeBySlug } from "../../services/recipeService";
import { DIFFICULTY_LABELS, formatMinutes } from "../../utils/recipeFormat";
import type { RecipeDetailLogic, RecipeMetaItem } from "./RecipeDetailTypes";

export const useRecipeDetailLogic = (slug: string | undefined): RecipeDetailLogic => {
  const navigate = useNavigate();
  const { state: auth } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const fetchRecipePage = useCallback(async () => {
    if (!slug) throw new Error("Missing recipe slug");
    const [recipe, categories] = await Promise.all([
      getRecipeBySlug(slug),
      getAllCategories(),
    ]);
    return { recipe, categories };
  }, [slug]);

  const { data, error, isLoading, reload } = useAsyncData(slug ? fetchRecipePage : null);

  const recipe = data?.recipe ?? null;
  const category = useMemo(
    () => data?.categories.find((c) => String(c.id) === String(data.recipe.categoryId)),
    [data],
  );
  const backHref = category ? `/categories/${category.slug}` : "/categories";

  const meta = useMemo<RecipeMetaItem[]>(() => {
    if (!recipe) return [];
    const items: RecipeMetaItem[] = [
      { label: "Prep", value: formatMinutes(recipe.prepTimeMinutes) },
      { label: "Cook", value: formatMinutes(recipe.cookTimeMinutes) },
      {
        label: "Total",
        value: formatMinutes(recipe.prepTimeMinutes + recipe.cookTimeMinutes),
      },
    ];
    if (recipe.prepTimeNote) items.push({ label: "Note", value: recipe.prepTimeNote });
    return items;
  }, [recipe]);

  const deleteRecipe = useCallback(async () => {
    if (!recipe || isDeleting) return;
    if (!window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) return;

    setIsDeleting(true);
    try {
      await apiDeleteRecipe(recipe.slug);
      navigate(backHref, { replace: true });
    } catch (err) {
      setToastMessage(getErrorMessage(err, "Failed to delete the recipe."));
      setIsDeleting(false);
    }
  }, [recipe, isDeleting, navigate, backHref]);

  const handleImageError = useCallback(() => {
    setFailedImageUrl(recipe?.imageUrl ?? null);
  }, [recipe]);

  const dismissToast = useCallback(() => setToastMessage(""), []);

  const isNotFound = !slug || isNotFoundError(error);
  const hasImage = Boolean(recipe?.imageUrl) && recipe?.imageUrl !== failedImageUrl;

  return {
    state: {
      recipe,
      isLoading,
      isNotFound,
      errorMessage:
        error && !isNotFound ? "We couldn't load this recipe. Please try again." : null,
      isAdmin: auth.isAdmin,
      isDeleting,
      difficulty: recipe?.difficulty ?? null,
      difficultyLabel: recipe ? (DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty) : "",
      meta,
      imageUrl: hasImage ? recipe?.imageUrl : undefined,
      backHref,
      backLabel: category ? `Back to ${category.name}` : "Back to categories",
      editHref: recipe ? `/edit/${recipe.slug}` : "/",
      toastMessage,
    },
    actions: { deleteRecipe, retry: reload, handleImageError, dismissToast },
  };
};
