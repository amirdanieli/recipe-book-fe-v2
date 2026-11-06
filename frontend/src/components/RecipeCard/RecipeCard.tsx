import { Link } from "react-router-dom";
import styles from "./RecipeCard.module.css";
import { useRecipeCardLogic } from "./RecipeCardLogic";
import type { RecipeCardProps } from "./RecipeCardTypes";

const RecipeCard = (props: RecipeCardProps) => {
  const { state, actions } = useRecipeCardLogic(props);

  return (
    <Link to={state.href} className={styles.card}>
      <div className={styles.media}>
        {state.imageUrl ? (
          <img
            src={state.imageUrl}
            alt=""
            loading="lazy"
            className={styles.image}
            onError={actions.handleImageError}
          />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">
            🍽️
          </span>
        )}
        <span className={`${styles.badge} ${styles[state.difficulty]}`}>
          {state.difficultyLabel}
        </span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{state.title}</h2>

        <dl className={styles.times}>
          <div className={styles.time}>
            <dt>Prep</dt>
            <dd>{state.prepTime}</dd>
          </div>
          <div className={styles.time}>
            <dt>Cook</dt>
            <dd>{state.cookTime}</dd>
          </div>
        </dl>

        {state.story && <p className={styles.story}>{state.story}</p>}
      </div>
    </Link>
  );
};

export default RecipeCard;
