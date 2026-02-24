import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const { isAdmin, logout } = useAuth();

  return (
    <header className={styles.container}>
      <h1>
        <Link to="/" className={styles.title}>
          Danieli's Recipe Book
        </Link>
      </h1>
      <nav className={styles.nav}>
        <Link className={styles.link} to="/">
          Home
        </Link>
        <Link className={styles.link} to="/categories">
          Categories
        </Link>
        {isAdmin && (
          <Link className={styles.link} to="/add">
            Add Recipe
          </Link>
        )}
        {!isAdmin && (
          <Link className={styles.link} to="/admin/login">
            Admin Login
          </Link>
        )}
        {isAdmin && <button onClick={logout}>Logout</button>}
      </nav>
    </header>
  );
};

export default Header;
