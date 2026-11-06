import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import { useSingleCategoryPageLogic } from "./SingleCategoryPageLogic";

const SingleCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state, actions } = useSingleCategoryPageLogic(slug);

  if (state.isLoading) return <LoadingSpinner fullPage label="Loading recipes…" />;

  return (
    <div className="content-container">
      <Link to="/categories" className="back-link">
        ← All categories
      </Link>

      {state.isNotFound ? (
        <div className="status-message">
          <h1 className="page-title">Category not found</h1>
          <p>This category doesn't exist (anymore).</p>
        </div>
      ) : (
        <>
          <h1 className="page-title">{state.categoryName || "Recipes"}</h1>

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
              <p>There are no recipes in this category yet.</p>
              {state.canAddRecipe && (
                <Link to="/add" className="button button--small">
                  + Add a recipe
                </Link>
              )}
            </div>
          )}

          {state.recipes.length > 0 && (
            <div className="card-grid">
              {state.recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleCategoryPage;
