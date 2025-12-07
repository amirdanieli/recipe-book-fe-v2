import { useNavigate, useParams } from "react-router";
import styles from "./AddEditRecipe.module.css";
import { useEffect, useState } from "react";
import mockRecipes from "../models/MockRecipe";
import type { Ingredient } from "../models/Ingredient";

const AddEditRecipe = () => {
  const categories = [
    // NEED TO FETCH FROM API
    { id: "c-breakfast", name: "Breakfast" },
    { id: "c-lunch", name: "Lunch" },
    { id: "c-dinner", name: "Dinner" },
    { id: "c-dessert", name: "Dessert" },
    { id: "c-snacks", name: "Snacks" },
    { id: "c-drinks", name: "Drinks" },
  ];

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const isEditMode = Boolean(slug);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(0);
  const [story, setStory] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    if (isEditMode && slug) {
      const recipeToEdit = mockRecipes.find((r) => r.slug === slug);
      if (recipeToEdit) {
        setTitle(recipeToEdit.title);
        setCategory(recipeToEdit.categoryId);
        setDifficulty(recipeToEdit.difficulty);
        setPrepTimeMinutes(recipeToEdit.prepTimeMinutes);
        setStory(recipeToEdit.story);
        setIngredients(recipeToEdit.ingredients);
        setSteps(recipeToEdit.steps);
      } else {
        console.error("Recipe not found for editing");
        navigate("/");
      }
    }
  }, [isEditMode, slug, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipeData = {
      title,
      categoryId: category,
      difficulty,
      prepTimeMinutes,
      story,
      ingredients,
      steps,
    };

    if (isEditMode) {
      console.log("Updating recipe:", recipeData);
      // Call API to UPDATE
    } else {
      console.log("Creating new recipe:", recipeData);
      // Call API to CREATE
    }

    navigate("/");
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
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
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Prep Time (minutes):</label>
          <input
            type="number"
            className={styles.input}
            value={prepTimeMinutes}
            onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
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
