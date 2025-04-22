import React from "react";
import "./Auth.css";

export function RegisterPage() {
  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form className="auth-form">
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
        <div className="auth-separator">or</div>
        <button type="button" className="google-auth">Sign up with Google</button>
      </form>
    </div>
  );
}