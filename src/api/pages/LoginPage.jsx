import { useState } from "react";

export default function LoginPage({ onLogin, busy, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onLogin(email.trim(), password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-badge" />
          <div>
            <div className="brand-title">IT Team Portal</div>
            <div className="brand-subtitle">BY IT DEV TEAM</div>
          </div>
        </div>

        <div className="login-title">Welcome to our Portal</div>
        <div className="login-text">
          Log in to access tickets, chat, info and your user dashboard.
        </div>

        {error ? <div className="alert">{error}</div> : null}

        <form className="form-grid" onSubmit={submit}>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
