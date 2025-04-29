import React from "react";
import "./Auth.css";

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
      </form>
    </div>
  );
}
