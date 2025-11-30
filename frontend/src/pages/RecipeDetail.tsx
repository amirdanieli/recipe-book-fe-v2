import { useParams, useLocation } from "react-router-dom";
import type { Recipe } from "../models/Recipe";
import mockRecipes from "../models/MockRecipe";
import styles from "./RecipeDetail.module.css";

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const stateRecipe = (location.state as { recipe?: Recipe } | null)?.recipe;

  const recipeSlug = slug ? decodeURIComponent(slug) : undefined;
  const recipe =
    stateRecipe ?? mockRecipes.find((r) => r.slug === recipeSlug) ?? null;

  if (!recipe) return <h1>Recipe not found</h1>;

  return (
    <div className={styles.wrapperContainer}>
      <div
        className={styles.imageContainer}
        aria-hidden="true"
        role="presentation"
      />

      <div className={styles.container}>
        <h1 className={styles.title}>{recipe.title}</h1>
        <div className={styles.row}>
          <strong className={styles.label}>Difficulty:</strong>
          <span className={styles.value}>{recipe.difficulty}</span>
        </div>
        <div className={styles.row}>
          <strong className={styles.label}>Prep time:</strong>
          <span className={styles.value}>{recipe.prepTimeMinutes} min</span>
        </div>
        <p className={styles.story}>{recipe.story}</p>
        <h3>Ingredients:</h3>
        <ul className={styles.list}>
          {recipe.ingredients.map((ing, index) => (
            <li key={index} className={styles.listItem}>
              {ing.quantity} {ing.unit} {ing.name}
            </li>
          ))}
        </ul>
        <h3>Steps:</h3>
        <ol className={styles.list}>
          {recipe.steps.map((step, index) => (
            <li key={index} className={styles.listItem}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetail;
