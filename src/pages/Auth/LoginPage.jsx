import React from "react";
import "./Auth.css";
import { Link } from "react-router-dom";


export function LoginPage() {
  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <div className="auth-separator">or</div>
        <button type="button" className="google-auth">Sign in with Google</button>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/forgot-password" style={{ color: "#e6d3a3", textDecoration: "underline" }}>
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
}
