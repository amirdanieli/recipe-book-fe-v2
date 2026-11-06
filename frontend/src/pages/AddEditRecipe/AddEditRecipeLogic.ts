import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncData } from "../../hooks/useAsyncData";
import type { Ingredient } from "../../models/Ingredient";
import { DIFFICULTIES, type Recipe, type RecipeInput } from "../../models/Recipe";
import { getErrorMessage } from "../../services/apiClient";
import { getAllCategories } from "../../services/categoryService";
import { uploadImage } from "../../services/imageService";
import { createRecipe, getRecipeBySlug, updateRecipe } from "../../services/recipeService";
import { DIFFICULTY_LABELS } from "../../utils/recipeFormat";
import type {
  AddEditRecipeLogic,
  FieldErrors,
  IngredientRow,
  MinutesField,
  RecipeFormValues,
  StepRow,
  TextField,
} from "./AddEditRecipeTypes";

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

let rowKeyCounter = 0;
const nextRowKey = () => `row-${++rowKeyCounter}`;

const emptyIngredient = (): IngredientRow => ({ key: nextRowKey(), name: "", quantity: "", unit: "" });
const emptyStep = (): StepRow => ({ key: nextRowKey(), text: "" });

const createEmptyValues = (): RecipeFormValues => ({
  title: "",
  categoryId: "",
  difficulty: "",
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  story: "",
  ingredients: [emptyIngredient()],
  steps: [emptyStep()],
});

const recipeToValues = (recipe: Recipe): RecipeFormValues => ({
  title: recipe.title,
  categoryId: recipe.categoryId,
  difficulty: recipe.difficulty,
  prepTimeMinutes: recipe.prepTimeMinutes,
  cookTimeMinutes: recipe.cookTimeMinutes,
  story: recipe.story ?? "",
  ingredients: recipe.ingredients.map((ing) => ({ ...ing, key: nextRowKey() })),
  steps: recipe.steps.map((text) => ({ key: nextRowKey(), text })),
});

const isBlankIngredient = (ing: IngredientRow) =>
  !ing.name.trim() && !ing.quantity.trim() && !ing.unit.trim();

/** Drops completely empty rows, then validates. */
const validate = (values: RecipeFormValues) => {
  const ingredients = values.ingredients.filter((ing) => !isBlankIngredient(ing));
  const steps = values.steps.filter((step) => step.text.trim());
  const errors: FieldErrors = {};

  if (!values.title.trim()) errors.title = "Title is required";
  if (!values.categoryId) errors.categoryId = "Category is required";
  if (!values.difficulty) errors.difficulty = "Difficulty is required";

  if (ingredients.length === 0) errors.ingredients = "Add at least one ingredient";
  else if (ingredients.some((ing) => !ing.name.trim()))
    errors.ingredients = "Every ingredient needs a name";

  if (steps.length === 0) errors.steps = "Add at least one step";

  return { errors, ingredients, steps };
};

const toMinutes = (raw: string) => {
  const value = Math.floor(Number(raw));
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const DIFFICULTY_OPTIONS = DIFFICULTIES.map((value) => ({
  value,
  label: DIFFICULTY_LABELS[value],
}));

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAddEditRecipeLogic = (slug: string | undefined): AddEditRecipeLogic => {
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [values, setValues] = useState<RecipeFormValues>(createEmptyValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

  // "/add" and "/edit/:slug" render this same component, so React keeps its
  // state when navigating between them. Reset the form when the slug changes.
  const [formSlug, setFormSlug] = useState(slug);
  if (formSlug !== slug) {
    setFormSlug(slug);
    setValues(createEmptyValues());
    setFieldErrors({});
    setExistingImageUrl("");
    setImageFile(null);
    setFilePreviewUrl(null);
    setLoadedSlug(null);
    setLoadErrorMessage(null);
  }

  const { data: categories, error: categoriesError } = useAsyncData(getAllCategories);

  // Edit mode: load the recipe into the form.
  useEffect(() => {
    if (!slug) return;
    let isActive = true;
    getRecipeBySlug(slug).then(
      (recipe) => {
        if (!isActive) return;
        setValues(recipeToValues(recipe));
        setExistingImageUrl(recipe.imageUrl ?? "");
        setLoadedSlug(slug);
      },
      (error: unknown) => {
        if (!isActive) return;
        setLoadErrorMessage(getErrorMessage(error, "We couldn't load this recipe."));
      },
    );
    return () => {
      isActive = false;
    };
  }, [slug]);

  // Free the object URL of the picked image on unmount.
  const previewUrlRef = useRef<string | null>(null);
  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const clearFieldError = useCallback((field: keyof FieldErrors) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  // --- simple fields -------------------------------------------------------

  const setTextField = useCallback(
    (field: TextField, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (field !== "story") clearFieldError(field);
    },
    [clearFieldError],
  );

  const setMinutesField = useCallback((field: MinutesField, rawValue: string) => {
    setValues((prev) => ({ ...prev, [field]: toMinutes(rawValue) }));
  }, []);

  const selectImage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = file ? URL.createObjectURL(file) : null;
    previewUrlRef.current = url;
    setImageFile(file);
    setFilePreviewUrl(url);
  }, []);

  // --- ingredients ---------------------------------------------------------

  const addIngredient = useCallback(() => {
    setValues((prev) => ({ ...prev, ingredients: [...prev.ingredients, emptyIngredient()] }));
    clearFieldError("ingredients");
  }, [clearFieldError]);

  const updateIngredient = useCallback(
    (key: string, field: keyof Ingredient, value: string) => {
      setValues((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing) =>
          ing.key === key ? { ...ing, [field]: value } : ing,
        ),
      }));
      clearFieldError("ingredients");
    },
    [clearFieldError],
  );

  const removeIngredient = useCallback((key: string) => {
    setValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.key !== key),
    }));
  }, []);

  // --- steps ---------------------------------------------------------------

  const addStep = useCallback(() => {
    setValues((prev) => ({ ...prev, steps: [...prev.steps, emptyStep()] }));
    clearFieldError("steps");
  }, [clearFieldError]);

  const updateStep = useCallback(
    (key: string, text: string) => {
      setValues((prev) => ({
        ...prev,
        steps: prev.steps.map((step) => (step.key === key ? { ...step, text } : step)),
      }));
      clearFieldError("steps");
    },
    [clearFieldError],
  );

  const removeStep = useCallback((key: string) => {
    setValues((prev) => ({ ...prev, steps: prev.steps.filter((step) => step.key !== key) }));
  }, []);

  // --- submit / cancel -----------------------------------------------------

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;

      const { errors, ingredients, steps } = validate(values);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) {
        setToastMessage("Please fix the highlighted fields.");
        return;
      }

      setIsSubmitting(true);
      try {
        let imageUrl = existingImageUrl || undefined;
        if (imageFile) {
          try {
            imageUrl = (await uploadImage(imageFile)).url;
          } catch (err) {
            throw new Error(getErrorMessage(err, "Image upload failed"), { cause: err });
          }
        }

        const payload: RecipeInput = {
          title: values.title.trim(),
          categoryId: values.categoryId,
          difficulty: values.difficulty as RecipeInput["difficulty"],
          prepTimeMinutes: values.prepTimeMinutes,
          cookTimeMinutes: values.cookTimeMinutes,
          story: values.story.trim(),
          ingredients: ingredients.map(({ name, quantity, unit }) => ({
            name: name.trim(),
            quantity: quantity.trim(),
            unit: unit.trim(),
          })),
          steps: steps.map((step) => step.text.trim()),
          imageUrl,
        };

        const saved = slug ? await updateRecipe(slug, payload) : await createRecipe(payload);
        navigate(`/recipes/${saved.slug}`);
      } catch (err) {
        setToastMessage(getErrorMessage(err, "Failed to save the recipe."));
        setIsSubmitting(false);
      }
    },
    [isSubmitting, values, existingImageUrl, imageFile, slug, navigate],
  );

  const cancel = useCallback(() => navigate(-1), [navigate]);
  const dismissToast = useCallback(() => setToastMessage(""), []);

  return {
    state: {
      isEditMode,
      pageTitle: isEditMode ? "Edit Recipe" : "Add Recipe",
      submitLabel: isSubmitting ? "Saving…" : isEditMode ? "Save Changes" : "Create Recipe",
      values,
      categories: categories ?? [],
      difficultyOptions: DIFFICULTY_OPTIONS,
      fieldErrors,
      imagePreviewUrl: filePreviewUrl ?? (existingImageUrl || null),
      isLoading: isEditMode && loadedSlug !== slug && !loadErrorMessage,
      loadErrorMessage,
      isSubmitting,
      categoriesErrorMessage: categoriesError
        ? "Couldn't load categories. Please refresh the page."
        : null,
      toastMessage,
    },
    actions: {
      setTextField,
      setMinutesField,
      selectImage,
      addIngredient,
      updateIngredient,
      removeIngredient,
      addStep,
      updateStep,
      removeStep,
      submit,
      cancel,
      dismissToast,
    },
  };
};
