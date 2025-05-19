import { useContext, useState } from "react";
import "./Auth.css";
import axios from "axios";
import { API_URL } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { login, loginGithub } = useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const registerRes = await api.post(`/auth/register`, {
        username,
        email,
        password
      })

      if (registerRes.status === 200) {
        toast.success('You are successfully registered')
      } else {
        toast.success('Registration error!')
      }

      const loginRes = await login(email, password);

      if (loginRes.status === 200) {
        toast.success('You are successfully logged in!')
      } else {
        toast.error('Log in error!')
      }

      navigate('/game-page');

    } catch (error) {
      toast.success('Something went wrong!')
    }
    setError("");
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        <button type="submit">Register</button>
        <div className="auth-separator">or</div>
        <button type="button" className="google-auth">Sign up with Google</button>
                <button type="button" className="google-auth" onClick={loginGithub}>Sign up with GitHub</button>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/login" style={{ color: "#e6d3a3", textDecoration: "underline", marginLeft: '1rem' }}>
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
