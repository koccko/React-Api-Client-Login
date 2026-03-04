import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/http.js";

function StatCard({ label, value, hint }) {
  return (
    <div className="stat">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
      <div className="statHint">{hint}</div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="stat">
      <div className="featureTitle">{title}</div>
      <div className="featureDesc">{desc}</div>
    </div>
  );
}

export default function Landing() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // if session exists, go straight in
        await apiFetch("/user"); // -> /api/user via http.js + proxy
        if (!alive) return;
        nav("/home", { replace: true }); // or "/dashboard" if you prefer
      } catch {
        if (!alive) return;
        setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [nav]);

  // Optional: while checking session, show same landing with muted UI
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
        {/* TOP BAR */}
        <div className="topbar">
          <div className="brand">IT TEAM</div>
          <div className="sub">Ticket System</div>

          <div style={{ marginLeft: 12 }}>
            <div className="badge-dev">🚧 В процес на разработка :)</div>
          </div>

          <div className="right">
            <button className="btn btnGhost" disabled>
              Register
            </button>
            <button className="btn btnPrimary" onClick={() => nav("/login")}>
              Login
            </button>
          </div>
        </div>

        {/* HERO */}
        <div className="gridHero">
          <div
            className="card cardPad"
            style={{ minHeight: 280, position: "relative", overflow: "hidden" }}
          >
            <div style={{ opacity: 0.75, fontWeight: 800 }}>
              Internal Helpdesk
            </div>

            <div className="h1">
              IT TEAM <span style={{ opacity: 0.85 }}>Ticket Platform</span>
            </div>

            <div className="p">
              Create, track and resolve tickets. Comments, statuses, priorities
              and history — all in one place. Register is disabled for now; we
              focus on login.
            </div>

            <div className="btnRow">
              <button className="btn btnPrimary" onClick={() => nav("/login")}>
                Open Login
              </button>
              <button className="btn btnGhost" disabled>
                Register (soon)
              </button>
              <div style={{ opacity: 0.65, fontSize: 12 }}>
                Secure cookie auth • Proxy no-CORS • Internal network
              </div>
            </div>
          </div>

          <div className="statsCol">
            <StatCard
              label="Auth"
              value="Cookie (HttpOnly)"
              hint="Validated via /api/user"
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

        {/* Features */}
        <div className="features">
          <Feature
            title="Ticket workflow"
            desc="Open → In progress → Resolved → Closed. History + comments."
          />
          <Feature
            title="Fast triage"
            desc="Priorities, filters, search and assigned user. Designed for IT."
          />
          <Feature
            title="Audit-friendly"
            desc="Action logs, reaction time and resolution time (SLA-ready)."
          />
        </div>

        <div style={{ marginTop: 18, opacity: 0.6, fontSize: 12 }}>
          IT Team Internal Tool • v0.2 • React + Vite + Router
        </div>
      </div>
    </div>
  );
}
