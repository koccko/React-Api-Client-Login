import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/http.js";

function Modal({ title, onClose, children }) {
  return (
    <div className="modalBack">
      <div className="modal">
        <div className="modalTop">
          <div className="modalTitle">{title}</div>
          <button className="modalClose" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}

export default function Login() {
  const nav = useNavigate();

  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in -> go home
  useEffect(() => {
    let alive = true;

    (async () => {
      setChecking(true);
      try {
        await apiFetch("/user"); // -> /api/user
        if (!alive) return;
        nav("/home", { replace: true });
      } catch {
        if (!alive) return;
        setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Login (cookie HttpOnly set by backend)
      await apiFetch("/login", {
        method: "POST",
        body: { email, password },
      });

      // Verify cookie worked
      await apiFetch("/user");

      nav("/home", { replace: true });
    } catch (e2) {
      setError(e2?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="bg">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div
          className="shell"
          style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
        >
          <div style={{ opacity: 0.8 }}>Checking session…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div className="shell">
        <div className="topbar">
          <div className="brand">IT TEAM</div>
          <div className="sub">Login</div>
          <div className="right">
            <button className="btn btnGhost" onClick={() => nav("/")}>
              Back
            </button>
          </div>
        </div>

        <Modal title="Login" onClose={() => nav("/")}>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <div style={{ opacity: 0.8, lineHeight: 1.4 }}>
              Enter email + password. Backend stores token in an{" "}
              <b>HttpOnly cookie</b>.
            </div>

            <label style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 800, opacity: 0.9 }}>Email</div>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 800, opacity: 0.9 }}>Password</div>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            {error && <div className="error">Error: {error}</div>}

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                className="btn btnPrimary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div style={{ marginLeft: "auto", opacity: 0.7, fontSize: 12 }}>
                Endpoint: <code>/api/login</code>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
