import { useParams, useLocation, useNavigate } from "react-router-dom";
import type { Recipe } from "../models/Recipe";
import mockRecipes from "../models/MockRecipe";
import styles from "./RecipeDetail.module.css";
import { useAuth } from "../hooks/useAuth";

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const auth = useAuth();
  const isAdmin = auth?.isAdmin;

  const stateRecipe = (location.state as { recipe?: Recipe } | null)?.recipe;

  const recipeSlug = slug ? decodeURIComponent(slug) : undefined;
  const recipe =
    stateRecipe ?? mockRecipes.find((r) => r.slug === recipeSlug) ?? null;

  const handleEdit = () => {
    navigate(`/edit/${encodeURIComponent(recipe.slug)}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      console.log("Deleting recipe:", recipe.id);
      // TODO: Call API to delete
      navigate("/"); // Redirect home after delete
    }
  };

  if (!recipe)
    return (
      <div className={"content-container"}>
        <h1>Recipe not found</h1>
      </div>
    );

  return (
    <div className={"content-container"}>
      <div className={styles.container}>
        {isAdmin && (
          <div className={styles.adminControls}>
            <button onClick={handleEdit} className={styles.editButton}>
              Edit Recipe
            </button>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          </div>
        )}

        <h1 className={styles.title}>{recipe.title}</h1>
        <div className={styles.row}>
          <strong className={styles.label}>Difficulty:</strong>
          <span className={styles.value}>{recipe.difficulty}</span>
        </div>
        <div className={styles.row}>
          <strong className={styles.label}>Prep time:</strong>
          <span className={styles.value}>{recipe.prepTimeMinutes} min</span>
        </div>
        <div className={styles.storyContainer}>
          <p className={styles.story}>{recipe.story}</p>
        </div>
        <div className={styles.split}>
          <div className={styles.left}>
            <h3>Ingredients:</h3>
            <ul className={styles.list}>
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className={styles.listItem}>
                  {ing.quantity} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.right}>
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
      </div>
    </div>
  );
};

export default RecipeDetail;
