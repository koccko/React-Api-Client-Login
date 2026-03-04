import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import { verifySession } from "../lib/api.js";

function pickFullName(u) {
  return (
    u?.full_name ||
    u?.name ||
    [u?.first_name, u?.last_name].filter(Boolean).join(" ") ||
    u?.username ||
    u?.email ||
    "—"
  );
}

function pickRole(u) {
  return u?.position || u?.job_title || u?.role || u?.department || "—";
}

export default function Home() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      setChecking(true);
      const s = await verifySession();
      if (!s.ok) {
        nav("/login", { replace: true });
        return;
      }
      setUser(s.user);
      setChecking(false);
    })();
  }, [nav]);

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
          <div style={{ opacity: 0.8 }}>Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <AppShell user={user} title="Home">
      <div className="homeGrid">
        <div className="card cardPad">
          <div style={{ opacity: 0.8, fontWeight: 800 }}>Профил</div>
          <div className="h2">{pickFullName(user)}</div>
          <div className="muted">{pickRole(user)}</div>

          <div className="hr" />

          <div className="kv">
            <div className="kvRow">
              <div className="kvKey">Email</div>
              <div className="kvVal">{user?.email || "—"}</div>
            </div>
            <div className="kvRow">
              <div className="kvKey">Username</div>
              <div className="kvVal">{user?.username || "—"}</div>
            </div>
            <div className="kvRow">
              <div className="kvKey">Department</div>
              <div className="kvVal">{user?.department || "—"}</div>
            </div>
          </div>
        </div>

        <div className="card cardPad">
          <div style={{ opacity: 0.8, fontWeight: 800 }}>Бързи действия</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Подготвени бутони за следващите стъпки.
          </div>

          <div className="quickRow">
            <button className="btn btnPrimary" onClick={() => nav("/tickets")}>
              Open Tickets
            </button>
            <button className="btn btnGhost" onClick={() => nav("/chat")}>
              Open Chat
            </button>
          </div>

          <div className="note">
            Следващи: Ticket CRUD, филтри, коментари, статуси + real-time chat.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
