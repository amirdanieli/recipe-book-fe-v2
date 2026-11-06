import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { useHomeLogic } from "./HomeLogic";

const Home = () => {
  const { state } = useHomeLogic();

  return (
    <div className="content-container">
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>What's Cooking?</h1>
        <p className={styles.heroSubtitle}>
          Welcome to the Danieli cookbook! Come in, look around, and have a taste of our
          family recipes.
        </p>
        <Link to="/categories" className={`button ${styles.heroButton}`}>
          Start browsing →
        </Link>
      </section>

      <section className={styles.grid}>
        {state.actionCards.map((card) => {
          const content = (
            <>
              <span className={styles.icon} aria-hidden="true">
                {card.icon}
              </span>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.description}</p>
            </>
          );

          return card.to ? (
            <Link key={card.id} to={card.to} className={styles.card}>
              {content}
            </Link>
          ) : (
            <div key={card.id} className={`${styles.card} ${styles.cardDisabled}`}>
              {content}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Home;
