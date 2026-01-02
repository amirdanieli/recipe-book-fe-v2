import type { Recipe } from "../../models/Recipe";
import styles from "./RecipeCard.module.css";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{recipe.title}</h2>

      <div className={styles.details}>
        <div className={styles.row}>
          <strong className={styles.label}>Difficulty:</strong>
          <span className={styles.value}>{recipe.difficulty}</span>
        </div>
        <div className={styles.row}>
          <strong className={styles.label}>Prep time:</strong>
          <span className={styles.value}>{recipe.prepTimeMinutes} min</span>
        </div>
        <div className={styles.row}>
          <strong className={styles.label}>Cook time:</strong>
          <span className={styles.value}>{recipe.cookTimeMinutes} min</span>
        </div>
      </div>

      <p className={styles["truncate-multi-line"]}>{recipe.story}</p>
    </div>
  );
};

export default RecipeCard;
