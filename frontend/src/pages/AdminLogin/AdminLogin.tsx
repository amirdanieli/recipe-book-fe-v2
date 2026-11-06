import { Navigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import { useAdminLoginLogic } from "./AdminLoginLogic";

const AdminLogin = () => {
  const { state, actions } = useAdminLoginLogic();

  if (state.isAlreadyLoggedIn) return <Navigate to={state.redirectTo} replace />;

  return (
    <div className="content-container">
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to add and edit family recipes.</p>

        {state.errorMessage && (
          <div className={styles.errorBox} role="alert">
            {state.errorMessage}
          </div>
        )}

        <form onSubmit={actions.submit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="login-email" className={styles.label}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={state.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="login-password" className={styles.label}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={state.password}
              onChange={(e) => actions.setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={`button ${styles.submit}`} disabled={state.isSubmitting}>
            {state.isSubmitting ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
