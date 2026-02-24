import { useParams } from "react-router-dom";
import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./SingleCategoryPage.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Recipe } from "../../models/Recipe";
import { getAllRecipes } from "../../services/recipeService";
import { getCategoryByIdOrSlug } from "../../services/categoryService";

const SingleCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const [recipesData, categoryData] = await Promise.all([
            getAllRecipes(slug),
            getCategoryByIdOrSlug(slug),
          ]);
          setRecipes(recipesData);
          setCategoryName(categoryData.name);
        } catch (err) {
          console.error("Failed to fetch data", err);
        }
      };
      fetchData();
    }
  }, [slug]);

  return (
    <div className={"content-container"}>
      <h1 className={styles.title}>{categoryName || "Recipes"}</h1>
      <div className={"list"}>
        {recipes.map((r) => (
          <Link
            key={r.id}
            to={`/recipes/${r.slug}`}
            className={styles.item}
            aria-label={`View ${r.title} recipes`}
          >
            <RecipeCard recipe={r}></RecipeCard>
          </Link>
        ))}
      </div>

      {/* <button
        className={"button"}
        onClick={() => {
          navigate("/");
        }}
      >
        Back
      </button> */}
    </div>
  );
};

export default SingleCategoryPage;
