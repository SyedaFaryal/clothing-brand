import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthTabs from "../components/AuthTabs.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          NOIR <span>&amp;</span> CO
        </div>
        <span className="eyebrow">Admin Console</span>

        <AuthTabs />

        <h1>Sign In</h1>

        {error && <div className="alert-error">{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@noirco.com"
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="btn btn-block" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="login-hint eyebrow" style={{ marginTop: 16 }}>
          <Link to="/forgot-password">Forgot password?</Link>
          {" · "}
          <Link to="/signup">Create admin account</Link>
        </p>

        <div className="credentials-hint">
          <span className="eyebrow">Default admin login (from backend seed)</span>
          <div className="credentials-row">
            <span>Email</span>
            <code>admin@noirco.com</code>
          </div>
          <div className="credentials-row">
            <span>Password</span>
            <code>Admin@12345</code>
          </div>
          <p>
            Change these in <code>backend/.env</code> (<code>ADMIN_EMAIL</code> /{" "}
            <code>ADMIN_PASSWORD</code>) before the first server start.
          </p>
        </div>
      </form>
    </div>
  );
}