import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./CategoriesList.module.css";
import { useCategoriesListLogic } from "./CategoriesListLogic";

const CategoriesList = () => {
  const { state, actions } = useCategoriesListLogic();

  return (
    <div className="content-container">
      <h1 className="page-title">Categories</h1>
      <p className="page-subtitle">Pick a category to see its recipes.</p>

      {state.isLoading && <LoadingSpinner label="Loading categories…" />}

      {state.errorMessage && (
        <div className="status-message status-message--error" role="alert">
          <p>{state.errorMessage}</p>
          <button type="button" className="button button--small" onClick={actions.retry}>
            Try again
          </button>
        </div>
      )}

      {state.isEmpty && (
        <div className="status-message">
          <p>No categories yet.</p>
        </div>
      )}

      {state.categories.length > 0 && (
        <div className={styles.grid}>
          {state.categories.map((category) => (
            <Link key={category.id} to={category.href} className={styles.item}>
              <h2 className={styles.cardTitle}>{category.name}</h2>
              {category.countLabel && (
                <span className={styles.cardCount}>{category.countLabel}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      <Link to="/" className="back-link">
        ← Back to home
      </Link>
    </div>
  );
};

export default CategoriesList;
