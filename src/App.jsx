import { useEffect, useState } from "react";

// ---- cookie helpers ----
function getCookie(name) {
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map((c) => c.trim());
  for (const p of parts) {
    if (p.startsWith(prefix)) return decodeURIComponent(p.slice(prefix.length));
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

// ---- UI bits ----
function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}) {
  const base = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontWeight: 700,
    letterSpacing: 0.2,
    transition:
      "transform 120ms ease, background 120ms ease, opacity 120ms ease",
    userSelect: "none",
  };

  const styles =
    variant === "primary"
      ? {
          ...base,
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(34,211,238,0.7))",
          color: "white",
        }
      : variant === "ghost"
        ? { ...base, background: "rgba(255,255,255,0.06)", color: "white" }
        : { ...base, background: "transparent", color: "white" };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      style={styles}
      onMouseDown={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.58)",
        display: "grid",
        placeItems: "center",
        padding: 18,
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          borderRadius: 18,
          background: "rgba(17, 24, 39, 0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div style={{ fontWeight: 900, letterSpacing: 0.3 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              borderRadius: 12,
              padding: "8px 10px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div style={{ opacity: 0.8, fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{value}</div>
      <div style={{ opacity: 0.72, fontSize: 12, marginTop: 6 }}>{hint}</div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ opacity: 0.75, marginTop: 6, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}

function LoginForm({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const LOGIN_ENDPOINT = "/api/login";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // backend set-cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || `Login failed (HTTP ${res.status})`);
        return;
      }

      // backend already sets cookie (BEARER)
      onLoggedIn();
    } catch (e2) {
      setError(e2?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <div style={{ opacity: 0.8, lineHeight: 1.4 }}>
        Въведи email и парола. След login token-ът се пази в cookie и системата
        те пуска към dashboard.
      </div>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 700, opacity: 0.9 }}>Email</div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(0,0,0,0.25)",
            color: "white",
            outline: "none",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 700, opacity: 0.9 }}>Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(0,0,0,0.25)",
            color: "white",
            outline: "none",
          }}
        />
      </label>

      {error && <div style={{ color: "#ff6b6b" }}>Error: {error}</div>}

      <div
        style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}
      >
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div style={{ marginLeft: "auto", opacity: 0.7, fontSize: 12 }}>
          Endpoint: <code>/api/login</code>
        </div>
      </div>
    </form>
  );
}

function DashboardPlaceholder({ onLogout }) {
  return (
    <div style={{ padding: "20px 28px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>IT TEAM</div>
        <div style={{ opacity: 0.7 }}>Tickets</div>
        <div style={{ marginLeft: "auto" }}>
          <Button variant="ghost" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 18, opacity: 0.85 }}>
        Logged ✅ (cookie <code>BEARER</code> detected). Следва: ticket
        dashboard-а.
      </div>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard label="Open" value="—" hint="Waiting for API /api/tickets" />
        <StatCard
          label="In Progress"
          value="—"
          hint="Waiting for API /api/tickets"
        />
        <StatCard
          label="Resolved"
          value="—"
          hint="Waiting for API /api/tickets"
        />
      </div>

      <div
        style={{
          marginTop: 14,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18,
          padding: 14,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ fontWeight: 800 }}>Next step</div>
        <div style={{ opacity: 0.75, marginTop: 6, lineHeight: 1.5 }}>
          Кажи ми endpoints на ticket системата (list, create, comments, status)
          и ще вържем реалните данни.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const t = getCookie("BEARER") || getCookie("it_token");
    setAuthed(Boolean(t));
  }, []);

  const logout = () => {
    deleteCookie("BEARER");
    deleteCookie("it_token");
    setAuthed(false);
  };

  if (authed) {
    return <DashboardPlaceholder onLogout={logout} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background:
          "radial-gradient(1200px 700px at 10% 0%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(1100px 700px at 90% 10%, rgba(34,211,238,0.25), transparent 60%), linear-gradient(180deg, #0b1220, #070b12)",
        color: "white",
      }}
    >
      {/* Top bar - FULL WIDTH */}
      <div
        style={{
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontWeight: 900, letterSpacing: 0.6 }}>IT TEAM</div>
        <div style={{ opacity: 0.7 }}>Ticket System</div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <Button variant="ghost" disabled>
            Register
          </Button>
          <Button variant="primary" onClick={() => setLoginOpen(true)}>
            Login
          </Button>
        </div>
      </div>

      {/* Main - FULL WIDTH */}
      <div
        style={{
          width: "100%",
          padding: "12px 28px 26px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(560px, 1.5fr) minmax(360px, 0.7fr)",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          {/* Hero */}
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 22,
              padding: 18,
              overflow: "hidden",
              position: "relative",
              minHeight: 260,
            }}
          >
            <div style={{ opacity: 0.75, fontWeight: 700 }}>
              Internal Helpdesk
            </div>
            <h1
              style={{
                margin: "8px 0 0",
                fontSize: 48,
                lineHeight: 1.05,
                letterSpacing: -0.5,
              }}
            >
              IT TEAM <span style={{ opacity: 0.85 }}>Ticket Platform</span>
            </h1>
            <div
              style={{
                marginTop: 10,
                opacity: 0.78,
                lineHeight: 1.6,
                maxWidth: 720,
              }}
            >
              Създавай, следи и решавай тикети. Коментари, статуси, приоритети и
              история — всичко на едно място. В момента фокусираме login-а.
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <Button variant="primary" onClick={() => setLoginOpen(true)}>
                Open Login
              </Button>
              <Button variant="ghost" disabled>
                Register (soon)
              </Button>
              <div style={{ opacity: 0.65, alignSelf: "center", fontSize: 12 }}>
                Secure cookie auth • Proxy no-CORS • Internal network
              </div>
            </div>

            {/* decorative blobs */}
            <div
              style={{
                position: "absolute",
                right: -70,
                top: -70,
                width: 240,
                height: 240,
                borderRadius: 999,
                background:
                  "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.55), transparent 60%)",
                filter: "blur(2px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 30,
                bottom: -110,
                width: 320,
                height: 320,
                borderRadius: 999,
                background:
                  "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.55), transparent 60%)",
                filter: "blur(2px)",
              }}
            />
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gap: 12 }}>
            <StatCard
              label="Auth"
              value="Cookie (BEARER)"
              hint="Backend sets token in cookie"
            />
            <StatCard
              label="API"
              value="/api/*"
              hint="Calls go through Vite proxy"
            />
            <StatCard
              label="Status"
              value="Login focus"
              hint="Register disabled for now"
            />
          </div>
        </div>

        {/* Features - FULL WIDTH */}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          <Feature
            title="Ticket workflow"
            desc="Open → In progress → Resolved → Closed. История на промени + коментари."
          />
          <Feature
            title="Fast triage"
            desc="Приоритети, филтри, търсене и assigned user. Всичко подредено за IT."
          />
          <Feature
            title="Audit-friendly"
            desc="Логове на действията, време за реакция и резолюция (SLA-ready)."
          />
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 18,
            opacity: 0.6,
            fontSize: 12,
            paddingBottom: 22,
          }}
        >
          IT Team Internal Tool • v0.1 • Built with React + Vite
        </div>
      </div>

      <Modal open={loginOpen} title="Login" onClose={() => setLoginOpen(false)}>
        <LoginForm
          onLoggedIn={() => {
            setLoginOpen(false);
            setAuthed(true);
          }}
        />
      </Modal>
    </div>
  );
}
