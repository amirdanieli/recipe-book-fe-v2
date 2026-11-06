import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { useHeaderLogic } from "./HeaderLogic";

const Header = () => {
  const { state, actions } = useHeaderLogic();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={actions.closeMenu}>
          <img src="/favicon.svg" alt="" className={styles.logo} />
          <span>Danieli's Recipe Book</span>
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          onClick={actions.toggleMenu}
          aria-label={state.isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={state.isMenuOpen}
          aria-controls="main-nav"
        >
          {state.isMenuOpen ? "✕" : "☰"}
        </button>

        <nav
          id="main-nav"
          className={`${styles.nav} ${state.isMenuOpen ? styles.open : ""}`}
          aria-label="Main"
        >
          {state.navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={actions.closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
          {state.canLogout && (
            <button type="button" className={styles.logout} onClick={actions.logout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
