import { Link } from "react-router-dom";
import styles from "./CategoriesList.module.css";

const categories = [
  { id: 1, name: "Breakfast", count: 12 },
  { id: 2, name: "Lunch", count: 25 },
  { id: 3, name: "Dinner", count: 18 },
  { id: 4, name: "Dessert", count: 10 },
  { id: 5, name: "Snacks", count: 8 },
  { id: 6, name: "Drinks", count: 5 },
];

const CategoriesList = () => {
  return (
    <div className={"content-container"}>
      <h1 className={styles.title}>Categories</h1>
      <div className={`list ${styles["categories-list"]}`}>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${encodeURIComponent(category.name)}`}
            className={styles.item}
            aria-label={`View ${category.name} recipes`}
          >
            <h3 className={styles.cardTitle}>{category.name}</h3>
            <span className={styles.cardCount}>{category.count} Recipes</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
