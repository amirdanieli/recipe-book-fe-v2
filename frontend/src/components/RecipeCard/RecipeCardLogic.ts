import { useCallback, useState } from "react";
import { DIFFICULTY_LABELS, formatMinutes } from "../../utils/recipeFormat";
import type { RecipeCardLogic, RecipeCardProps } from "./RecipeCardTypes";

export const useRecipeCardLogic = ({ recipe }: RecipeCardProps): RecipeCardLogic => {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const handleImageError = useCallback(() => {
    setFailedImageUrl(recipe.imageUrl ?? null);
  }, [recipe.imageUrl]);

  const hasImage = Boolean(recipe.imageUrl) && recipe.imageUrl !== failedImageUrl;

  return {
    state: {
      title: recipe.title,
      href: `/recipes/${recipe.slug}`,
      story: recipe.story,
      difficulty: recipe.difficulty,
      difficultyLabel: DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty,
      prepTime: formatMinutes(recipe.prepTimeMinutes),
      cookTime: formatMinutes(recipe.cookTimeMinutes),
      imageUrl: hasImage ? recipe.imageUrl : undefined,
    },
    actions: { handleImageError },
  };
};
