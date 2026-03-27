import { useNavigate, useParams } from "react-router-dom";
import styles from "./AddEditRecipe.module.css";
import { useEffect, useState, useCallback } from "react";
import type { Ingredient } from "../models/Ingredient";
import { getAllCategories } from "../services/categoryService";
import {
  createRecipe,
  getRecipeBySlug,
  updateRecipe,
} from "../services/recipeService";
import type { Category } from "../models/Category";
import { uploadImage } from "../services/imageService";
import Toast from "../components/Toast/Toast";
import LoadingSpinner from "../components/Loader/LoadingSpinner";

interface FieldErrors {
  title?: string;
  category?: string;
  difficulty?: string;
  ingredients?: string;
  steps?: string;
}

const AddEditRecipe = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const isEditMode = Boolean(slug);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(0);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(0);
  const [story, setStory] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && slug) {
      setIsLoading(true);
      const fetchRecipe = async () => {
        try {
          const recipeToEdit = await getRecipeBySlug(slug);
          setTitle(recipeToEdit.title);
          setCategory(recipeToEdit.categoryId);
          setDifficulty(recipeToEdit.difficulty);
          setPrepTimeMinutes(recipeToEdit.prepTimeMinutes);
          setCookTimeMinutes(recipeToEdit.cookTimeMinutes);
          setStory(recipeToEdit.story);
          setIngredients(recipeToEdit.ingredients);
          setSteps(recipeToEdit.steps);
          setImageUrl(recipeToEdit.imageUrl || "");
        } catch (err) {
          console.error("Recipe not found for editing", err);
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [isEditMode, slug, navigate]);

  const validate = useCallback((): boolean => {
    const errors: FieldErrors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!category) errors.category = "Category is required";
    if (!difficulty) errors.difficulty = "Difficulty is required";
    if (ingredients.length === 0) {
      errors.ingredients = "Add at least one ingredient";
    } else if (ingredients.some((ing) => !ing.name.trim())) {
      errors.ingredients = "All ingredients must have a name";
    }
    if (steps.length === 0) {
      errors.steps = "Add at least one step";
    } else if (steps.some((s) => !s.trim())) {
      errors.steps = "All steps must have a description";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setToastMessage("Some required fields are missing");
      return false;
    }
    return true;
  }, [title, category, difficulty, ingredients, steps]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      try {
        const uploadRes = await uploadImage(imageFile);
        uploadedImageUrl = uploadRes.url;
      } catch (err) {
        console.error("Image upload failed", err);
        return;
      }
    }

    const recipeData = {
      title,
      categoryId: category,
      difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
      prepTimeMinutes,
      cookTimeMinutes,
      story,
      ingredients,
      steps,
      imageUrl: uploadedImageUrl,
    };

    try {
      let savedRecipe;
      if (isEditMode && slug) {
        savedRecipe = await updateRecipe(slug, recipeData);
      } else {
        savedRecipe = await createRecipe(recipeData);
      }

      navigate(`/recipes/${savedRecipe.slug}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save recipe";
      setToastMessage(message);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={"content-container"}>
      <h1>{isEditMode ? "Edit Recipe" : "Add Recipe"}</h1>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage("")}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title:</label>
          <input
            type="text"
            className={`${styles.input} ${fieldErrors.title ? styles.inputError : ""}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFieldErrors((p) => ({ ...p, title: undefined }));
            }}
          />
          {fieldErrors.title && (
            <span className={styles.fieldError}>{fieldErrors.title}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category:</label>
          <select
            className={`${styles.input} ${fieldErrors.category ? styles.inputError : ""}`}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setFieldErrors((p) => ({ ...p, category: undefined }));
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <span className={styles.fieldError}>{fieldErrors.category}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Difficulty:</label>
          <select
            className={`${styles.input} ${fieldErrors.difficulty ? styles.inputError : ""}`}
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setFieldErrors((p) => ({ ...p, difficulty: undefined }));
            }}
          >
            <option value="">Select Difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          {fieldErrors.difficulty && (
            <span className={styles.fieldError}>{fieldErrors.difficulty}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Image:</label>
          <input
            type="file"
            className={styles.input}
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            accept="image/*"
          />
          {imageUrl && !imageFile && (
            <div className={styles.imagePreview}>
              <img src={imageUrl} alt="Current recipe" />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Prep Time (minutes):</label>
          <input
            type="number"
            className={styles.input}
            value={prepTimeMinutes}
            min={0}
            onChange={(e) =>
              setPrepTimeMinutes(Math.max(0, Number(e.target.value)))
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Cook Time (minutes):</label>
          <input
            type="number"
            className={styles.input}
            value={cookTimeMinutes}
            min={0}
            onChange={(e) =>
              setCookTimeMinutes(Math.max(0, Number(e.target.value)))
            }
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Story:</label>
          <textarea
            className={styles.input}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={5}
          />
        </div>

        <div className={styles.section}>
          <label
            className={`${styles.label} ${fieldErrors.ingredients ? styles.labelError : ""}`}
          >
            Ingredients:
          </label>
          {fieldErrors.ingredients && (
            <span className={styles.fieldError}>{fieldErrors.ingredients}</span>
          )}
          {ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
              <input
                type="text"
                placeholder="Qty"
                className={styles.inputSmall}
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Unit"
                className={styles.inputSmall}
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Ingredient Name"
                className={styles.input}
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveIngredient(index)}
                aria-label="Remove ingredient"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => {
              handleAddIngredient();
              setFieldErrors((p) => ({ ...p, ingredients: undefined }));
            }}
          >
            + Add Ingredient
          </button>
        </div>

        <div className={styles.section}>
          <label
            className={`${styles.label} ${fieldErrors.steps ? styles.labelError : ""}`}
          >
            Steps:
          </label>
          {fieldErrors.steps && (
            <span className={styles.fieldError}>{fieldErrors.steps}</span>
          )}
          {steps.map((step, index) => (
            <div key={index} className={styles.stepRow}>
              <span className={styles.stepNumber}>{index + 1}.</span>
              <textarea
                className={styles.input}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Describe step ${index + 1}...`}
                rows={2}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveStep(index)}
                aria-label="Remove step"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => {
              handleAddStep();
              setFieldErrors((p) => ({ ...p, steps: undefined }));
            }}
          >
            + Add Step
          </button>
        </div>

        <div className={styles.buttonsContainer}>
          <button type="submit" className={"button"}>
            {isEditMode ? "Save Changes" : "Create Recipe"}
          </button>
          <button className={"button"} onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddEditRecipe;
