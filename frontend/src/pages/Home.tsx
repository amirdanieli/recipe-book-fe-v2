import styles from "./Home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className={"content-container"}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>What's Cooking?</h1>
          <p className={styles.heroSubtitle}>
            Welcome to Danieli's cookbook! We warmly welcome you to explore, and
            have a taste of our family recipes.
          </p>
        </section>

        <section className={styles.grid}>
          <Link to="/categories" className={styles.card}>
            <div className={styles.icon}>📖</div>
            <h2 className={styles.cardTitle}>Browse Cookbook</h2>
            <p className={styles.cardDesc}>
              Explore your collection by category. From breakfast to dessert,
              find exactly what you're craving.
            </p>
          </Link>

          <Link to="/add" className={styles.card}>
            <div className={styles.icon}>✍️</div>
            <h2 className={styles.cardTitle}>Add New Recipe</h2>
            <p className={styles.cardDesc}>
              Found a new favorite? Save it here with ingredients, steps, and
              your personal story.
            </p>
          </Link>

          {/* Optional: Favorites or Random (Placeholder for now) */}
          <div
            className={styles.card}
            style={{ opacity: 0.7, cursor: "default" }}
          >
            <div className={styles.icon}>⭐</div>
            <h2 className={styles.cardTitle}>Favorites</h2>
            <p className={styles.cardDesc}>
              Coming soon! Quickly access your most loved meals.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
