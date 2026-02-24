import { useParams, useNavigate } from "react-router-dom";
import type { Recipe } from "../models/Recipe";
import styles from "./RecipeDetail.module.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { deleteRecipe, getRecipeBySlug } from "../services/recipeService";
import { getAllCategories } from "../services/categoryService";
import type { Category } from "../models/Category";
import LoadingSpinner from "../components/Loader/LoadingSpinner";

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { isAdmin } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const [recipeData, categoriesData] = await Promise.all([
            getRecipeBySlug(slug),
            getAllCategories(),
          ]);
          setRecipe(recipeData);
          setCategories(categoriesData);
        } catch (err) {
          console.error("Failed to fetch recipe", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [slug]);

  const handleEdit = () => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
    if (recipe) {
      navigate(`/edit/${recipe.slug}`);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
    if (!recipe) return;
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      try {
        await deleteRecipe(recipe.slug);

        const categoryObj = categories.find(
          (c) => String(c.id) === String(recipe.categoryId),
        );
        if (categoryObj?.slug) {
          navigate(`/categories/${categoryObj.slug}`);
        } else {
          navigate("/categories");
        }
      } catch (err) {
        console.error("Failed to delete recipe", err);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

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
        <div className={styles.row}>
          <strong className={styles.label}>Cook time:</strong>
          <span className={styles.value}>{recipe.cookTimeMinutes} min</span>
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
        <button
          className={"button"}
          onClick={() => {
            const categoryObj = categories.find(
              (c) => String(c.id) === String(recipe?.categoryId),
            );
            if (categoryObj?.slug) {
              navigate(`/categories/${categoryObj.slug}`);
            } else {
              navigate("/categories");
            }
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
