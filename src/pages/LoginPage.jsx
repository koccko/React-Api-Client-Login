import { useEffect, useState } from "react";
import { apiFetch } from "../api/http.js";

export default function LoginPage({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // if already logged in -> call onLoggedIn
  useEffect(() => {
    let alive = true;

    (async () => {
      setChecking(true);
      try {
        await apiFetch("/user"); // -> /api/user
        if (!alive) return;
        onLoggedIn?.();
      } catch {
        if (!alive) return;
        setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [onLoggedIn]);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // IMPORTANT: apiFetch uses credentials: "include" already (in your http.js)
      await apiFetch("/login", {
        method: "POST",
        body: { email, password },
      });

      // verify cookie session
      await apiFetch("/user");

      onLoggedIn?.();
    } catch (e2) {
      setError(e2?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div style={{ padding: 40, opacity: 0.8 }}>Checking session…</div>;
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial", maxWidth: 560 }}>
      <h1 style={{ marginBottom: 6 }}>IT TEAM API CLIENT</h1>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>
        Login with email + password (HttpOnly cookie)
      </div>

      <form onSubmit={login} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <div style={{ color: "#dc2626" }}>Error: {error}</div>}
      </form>

      <div style={{ marginTop: 16, opacity: 0.7, fontSize: 12 }}>
        Endpoint: <code>/api/login</code> (via proxy)
      </div>
    </div>
  );
}
