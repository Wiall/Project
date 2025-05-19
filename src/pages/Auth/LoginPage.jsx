import { useContext, useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";


export function LoginPage() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('');
  const { login, loginGoogle, loginGithub } = useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password)
      if(res.status === 200) {
        toast.success('You are successfully logged in!')
      } else {
        toast.error('Log in error!')
      }
      navigate('/game-page')
    } catch (error) { 
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <div className="auth-separator">or</div>
        <button type="button" className="google-auth" onClick={loginGoogle}>Sign in with Google</button>
        <button type="button" className="google-auth" onClick={loginGithub}>Sign in with GitHub</button>
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link to="/forgot-password" style={{ color: "#e6d3a3", textDecoration: "underline" }}>
            Forgot your password?
          </Link>
          <Link to="/register" style={{ color: "#e6d3a3", textDecoration: "underline", marginLeft: '1rem' }}>
            Don't have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
