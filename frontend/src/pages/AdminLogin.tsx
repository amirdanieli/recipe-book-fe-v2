import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
// import { useAuth } from "../hooks/useAuth.ts";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../services/authService";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await apiLogin(email, password);
      login(data.user);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      console.log(err);
    }
  };

  return (
    <div className="content-container">
      <h2>Admin Login</h2>

      {error && <div className={styles.errorBox}>{error}</div>}

      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
