import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess(false);
      return;
    }

    setError("");
    setSuccess(true);
    console.log("New password:", password);

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        {success && <p style={{ color: "lightgreen", marginBottom: "1rem" }}>Password updated! Redirecting...</p>}

        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}
