import { useState } from "react";

function setCookie(name, value, days = 7) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export default function LoginPage({ onLoggedIn }) {
  const [email, setEmail] = useState("emiremrol@gmail.com");
  const [password, setPassword] = useState("12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Важно: през Vite proxy
  const LOGIN_ENDPOINT = "/api/login";

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || `Login failed (HTTP ${res.status})`);
        return;
      }

      // backend може да върне token по различни ключове
      const token = data?.token || data?.access_token || data?.jwt;

      if (!token) {
        setError(
          "Login OK, but token not found in response (expected token/access_token/jwt).",
        );
        return;
      }

      // По твоя скрийншот cookie-то е BEARER
      setCookie("BEARER", token, 7);

      onLoggedIn();
    } catch (e2) {
      setError(e2?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial", maxWidth: 560 }}>
      <h1 style={{ marginBottom: 6 }}>IT TEAM API CLIENT</h1>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>
        Login with email + password
      </div>

      <form onSubmit={login} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <div style={{ color: "#dc2626" }}>Error: {error}</div>}
      </form>

      <div style={{ marginTop: 16, opacity: 0.7, fontSize: 12 }}>
        Endpoint: <code>{LOGIN_ENDPOINT}</code>
      </div>
    </div>
  );
}
