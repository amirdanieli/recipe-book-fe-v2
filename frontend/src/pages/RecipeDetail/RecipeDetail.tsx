import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Toast from "../../components/Toast/Toast";
import styles from "./RecipeDetail.module.css";
import { useRecipeDetailLogic } from "./RecipeDetailLogic";

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state, actions } = useRecipeDetailLogic(slug);

  if (state.isLoading) return <LoadingSpinner fullPage label="Loading recipe…" />;

  if (state.isNotFound || state.errorMessage || !state.recipe) {
    return (
      <div className="content-container">
        <Link to="/categories" className="back-link">
          ← Back to categories
        </Link>
        {state.errorMessage ? (
          <div className="status-message status-message--error" role="alert">
            <p>{state.errorMessage}</p>
            <button type="button" className="button button--small" onClick={actions.retry}>
              Try again
            </button>
          </div>
        ) : (
          <div className="status-message">
            <h1 className="page-title">Recipe not found</h1>
            <p>We couldn't find this recipe. It may have been renamed or removed.</p>
          </div>
        )}
      </div>
    );
  }

  const { recipe } = state;

  return (
    <div className="content-container">
      {state.toastMessage && (
        <Toast message={state.toastMessage} type="error" onClose={actions.dismissToast} />
      )}

      <div className={styles.topBar}>
        <Link to={state.backHref} className="back-link">
          ← {state.backLabel}
        </Link>
        {state.isAdmin && (
          <div className={styles.adminControls}>
            <Link to={state.editHref} className="button button--secondary button--small">
              Edit
            </Link>
            <button
              type="button"
              className="button button--danger button--small"
              onClick={actions.deleteRecipe}
              disabled={state.isDeleting}
            >
              {state.isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className="page-title">{recipe.title}</h1>
          <ul className={styles.meta}>
            {state.difficulty && (
              <li className={`${styles.pill} ${styles[state.difficulty]}`}>
                {state.difficultyLabel}
              </li>
            )}
            {state.meta.map((item) => (
              <li key={item.label} className={styles.pill}>
                <span className={styles.pillLabel}>{item.label}</span> {item.value}
              </li>
            ))}
          </ul>
        </header>

        {state.imageUrl && (
          <img
            src={state.imageUrl}
            alt={recipe.title}
            className={styles.image}
            onError={actions.handleImageError}
          />
        )}

        {recipe.story && <blockquote className={styles.story}>{recipe.story}</blockquote>}

        <div className={styles.split}>
          <section className={`${styles.panel} ${styles.ingredients}`}>
            <h2 className={styles.panelTitle}>Ingredients</h2>
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map((ing, index) => (
                <li key={`${ing.name}-${index}`}>
                  {(ing.quantity || ing.unit) && (
                    <span className={styles.amount}>
                      {[ing.quantity, ing.unit].filter(Boolean).join(" ")}
                    </span>
                  )}
                  <span>{ing.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${styles.panel} ${styles.steps}`}>
            <h2 className={styles.panelTitle}>Steps</h2>
            <ol className={styles.stepList}>
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </article>
    </div>
  );
};

export default RecipeDetail;
