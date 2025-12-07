import { useParams } from "react-router-dom";
import RecipeCard from "../RecipeCard/RecipeCard";
import mockRecipes from "../../models/MockRecipe";
import styles from "./SingleCategoryPage.module.css";
import { Link } from "react-router-dom";

const recipes = [...mockRecipes];

const SingleCategoryPage = () => {
  const { name } = useParams<{ name: string }>();
  const categoryName = name ? decodeURIComponent(name) : "Unkown";

  return (
    <div className={"content-container"}>
      <h1 className={styles.title}>{categoryName}</h1>
      <div className={"list"}>
        {recipes.map((r) => (
          <Link
            key={r.id}
            to={`/recipes/${encodeURIComponent(r.slug)}`}
            state={{ recipe: r }}
            className={styles.item}
            aria-label={`View ${r.title} recipes`}
          >
            <RecipeCard recipe={r}></RecipeCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SingleCategoryPage;
