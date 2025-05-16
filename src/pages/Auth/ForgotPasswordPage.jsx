import React from "react";
import "./Auth.css";

export function ForgotPasswordPage() {
  return (
    <div className="auth-container">
      <h2>Confirm reset</h2>
      <form className="auth-form">
      <div className="email-row">
        <input type="email" placeholder="Enter your email" required />
        <button type="submit" className="send-code">Send code</button>
      </div>

      <div className="auth-separator">and</div>

      <input type="text" placeholder="Enter the code" required />
      <button type="button" className="confirm-code">Confirm</button>
    </form>
    </div>
  );
}