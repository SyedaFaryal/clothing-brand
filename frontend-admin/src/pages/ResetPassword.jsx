import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ResetPassword() {
  const { token } = useParams();
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { user, token: authToken } = await api.resetPassword(token, password);
      setSession(user, authToken);
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
        <h1>Set New Password</h1>

        {error && <div className="alert-error">{error}</div>}

        <label>New Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{ marginBottom: 16 }}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          style={{ marginBottom: 24 }}
        />

        <button className="btn btn-block" type="submit" disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>

        <p className="login-hint eyebrow" style={{ marginTop: 20 }}>
          <Link to="/login">← Back to login</Link>
        </p>
      </form>
    </div>
  );
}
