import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.forgotPassword(email);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          NOIR <span>&amp;</span> CO
        </div>
        <span className="eyebrow">Admin Console</span>
        <h1>Reset Password</h1>

        {error && <div className="alert-error">{error}</div>}

        {!result ? (
          <form onSubmit={handleSubmit}>
            <p style={{ marginBottom: 18, fontSize: 14, color: "rgba(20,20,15,0.7)" }}>
              Enter your admin email and we'll generate a reset link.
            </p>
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@noirco.com"
              style={{ marginBottom: 20 }}
            />
            <button className="btn btn-block" type="submit" disabled={loading}>
              {loading ? "Generating…" : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{result.message}</p>
            {result.resetUrl && (
              <>
                <p className="eyebrow" style={{ marginBottom: 8 }}>
                  Demo mode — no email service is configured, so here's your link directly:
                </p>
                <Link to={`/reset-password/${result.resetToken}`} className="btn btn-block">
                  Open Reset Link
                </Link>
              </>
            )}
          </div>
        )}

        <p className="login-hint eyebrow" style={{ marginTop: 24 }}>
          <Link to="/login">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
