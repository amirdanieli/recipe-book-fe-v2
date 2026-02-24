import { Link, useNavigate } from "react-router-dom";
import styles from "./CategoriesList.module.css";
import { useEffect, useState } from "react";
import type { Category } from "../models/Category";
import { getAllCategories } from "../services/categoryService";

const CategoriesList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className={"content-container"}>
      <h1 className={styles.title}>Categories</h1>
      <div className={`list ${styles["categories-list"]}`}>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className={styles.item}
            aria-label={`View ${category.name} recipes`}
          >
            <h3 className={styles.cardTitle}>{category.name}</h3>
            <span className={styles.cardCount}>{category.count} Recipes</span>
          </Link>
        ))}
      </div>

      <button
        className={"button"}
        onClick={() => {
          navigate("/");
        }}
      >
        Back
      </button>
    </div>
  );
};

export default CategoriesList;
