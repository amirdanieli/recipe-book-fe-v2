import { useNavigate, useParams } from "react-router-dom";
import styles from "./AddEditRecipe.module.css";
import { useEffect, useState } from "react";
import type { Ingredient } from "../models/Ingredient";
import { getAllCategories } from "../services/categoryService";
import {
  createRecipe,
  getRecipeBySlug,
  updateRecipe,
} from "../services/recipeService";
import type { Category } from "../models/Category";
import { uploadImage } from "../services/imageService";

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
        }
      };
      fetchRecipe();
    }
  }, [isEditMode, slug, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      difficulty: difficulty as any,
      prepTimeMinutes,
      cookTimeMinutes,
      story,
      ingredients,
      steps,
      imageUrl: uploadedImageUrl,
    };

    try {
      if (isEditMode && slug) {
        await updateRecipe(slug, recipeData);
      } else {
        await createRecipe(recipeData);
      }

      const selectedCategory = categories.find((cat) => cat.id === category);
      if (selectedCategory?.slug) {
        navigate(`/categories/${selectedCategory.slug}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to save recipe", err);
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

  return (
    <div className={"content-container"}>
      <h1>{isEditMode ? "Edit Recipe" : "Add Recipe"}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title:</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category:</label>
          <select
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Difficulty:</label>
          <select
            className={styles.input}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="">Select Difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
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
          <label className={styles.label}>Ingredients:</label>
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
                required
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
            onClick={handleAddIngredient}
          >
            + Add Ingredient
          </button>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>Steps:</label>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepRow}>
              <span className={styles.stepNumber}>{index + 1}.</span>
              <textarea
                className={styles.input}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Describe step ${index + 1}...`}
                rows={2}
                required
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
            onClick={handleAddStep}
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
