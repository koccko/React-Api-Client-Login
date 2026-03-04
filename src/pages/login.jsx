import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, apiFetch, verifySession } from "../lib/api.js";

function Modal({ title, children }) {
  return (
    <div className="modalBack">
      <div className="modal">
        <div className="modalTop">
          <div className="modalTitle">{title}</div>
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

  // If already logged -> go dashboard
  useEffect(() => {
    (async () => {
      setChecking(true);
      const s = await verifySession();
      if (s.ok) nav("/dashboard", { replace: true });
      setChecking(false);
    })();
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { res, data } = await apiFetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError(data?.message || `Login failed (HTTP ${res.status})`);
        return;
      }

      // Verify session via API (cookie is HttpOnly)
      const s = await verifySession();
      if (s.ok) nav("/dashboard", { replace: true });
      else
        setError(
          "Logged in but session verify failed. Check /api/user endpoint.",
        );
    } catch (e2) {
      setError(e2?.message || "Failed to fetch");
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
          <div
            className="brand"
            style={{ cursor: "pointer" }}
            onClick={() => nav("/")}
          >
            IT TEAM
          </div>
          <div className="sub">Ticket System</div>
          <div style={{ marginLeft: 12 }}>
            <div className="badge-dev">🚧 В процес на разработка :)</div>
          </div>

          <div className="right">
            <button className="btn btnGhost" onClick={() => nav("/")}>
              Back
            </button>
          </div>
        </div>

        <Modal title="Login">
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <div style={{ opacity: 0.8, lineHeight: 1.4 }}>
              Enter email + password. Backend stores token in an HttpOnly cookie
              (not readable by JS).
            </div>

            <label style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 800, opacity: 0.9 }}>Email</div>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 800, opacity: 0.9 }}>Password</div>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
