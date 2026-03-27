import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";
import { useState } from "react";

const Header = () => {
  const { isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.container}>
      <div className={styles.titleRow}>
        <h1>
          <Link to="/" className={styles.title} onClick={closeMenu}>
            Danieli's Recipe Book
          </Link>
        </h1>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        <Link className={styles.link} to="/" onClick={closeMenu}>
          Home
        </Link>
        <Link className={styles.link} to="/categories" onClick={closeMenu}>
          Categories
        </Link>
        {isAdmin && (
          <Link className={styles.link} to="/add" onClick={closeMenu}>
            Add Recipe
          </Link>
        )}
        {!isAdmin && (
          <Link className={styles.link} to="/admin/login" onClick={closeMenu}>
            Admin Login
          </Link>
        )}
        {isAdmin && (
          <button
            onClick={() => {
              logout();
              closeMenu();
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
