import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendCode = (e) => {
    e.preventDefault();

    if (cooldown > 0) return; // Защита от ручного вызова

    // Здесь должен быть вызов API для отправки кода
    console.log("Отправка кода на почту:", email);

    setCodeSent(true);
    setCooldown(30); // Устанавливаем таймер на 30 секунд
  };

  const handleConfirmCode = () => {
    // Здесь можно проверить код через API
    console.log("Подтверждение кода:", code);

    // Если код верный:
    navigate("/reset-password");
  };

  return (
    <div className="auth-container">
      <h2>Confirm reset</h2>
      <form className="auth-form" onSubmit={handleSendCode}>
        <div className="email-row">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="send-code"
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `Wait ${cooldown}s` : "Send code"}
          </button>
        </div>

        <div className="auth-separator">and</div>

        <input
          type="text"
          placeholder="Enter the code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={!codeSent}
        />
        <button
          type="button"
          className="confirm-code"
          onClick={handleConfirmCode}
          disabled={!codeSent}
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
