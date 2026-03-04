import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { API } from "../lib/api.js";
import { apiFetch } from "../api/http.js";

function formatBG(dt) {
  const days = [
    "Неделя",
    "Понеделник",
    "Вторник",
    "Сряда",
    "Четвъртък",
    "Петък",
    "Събота",
  ];
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yyyy = dt.getFullYear();
  const hh = String(dt.getHours()).padStart(2, "0");
  const min = String(dt.getMinutes()).padStart(2, "0");
  const ss = String(dt.getSeconds()).padStart(2, "0");
  return `${days[dt.getDay()]} • ${dd}.${mm}.${yyyy} • ${hh}:${min}:${ss}`;
}

function initialsFromUser(user) {
  const name = user?.name || user?.full_name || user?.email || "IT";
  const parts = String(name)
    .split(/[\s@._-]+/)
    .filter(Boolean);
  const a = (parts[0] || "I")[0];
  const b = (parts[1] || "T")[0];
  return (a + b).toUpperCase();
}

function NavBtn({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `navBtn2 ${isActive ? "navBtn2Active" : ""}`}
    >
      <span className="navWave" />
      <span className="navContent">
        <span className="navIcon">{icon}</span>
        <span className="navLabel">{label}</span>
      </span>
      <span className="navUnderline" />
    </NavLink>
  );
}

export default function AppShell({ user, title, children }) {
  const nav = useNavigate();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const onLogout = useMemo(() => {
    return async () => {
      try {
        await apiFetch(API.logout, { method: "POST" });
      } catch {}
      nav("/login", { replace: true });
    };
  }, [nav]);

  return (
    <div className="bg">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div className="shell">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="brand">IT TEAM</div>
          <div className="sub">{title}</div>

          {/* NAV */}
          <div className="navRow">
            <NavBtn to="/home" icon="🏠" label="Home" />
            <NavBtn to="/tickets" icon="🎫" label="Tickets" />
            <NavBtn to="/chat" icon="💬" label="Chat" />
          </div>

          <div className="right">
            <div className="clock" title="Local time">
              {formatBG(now)}
            </div>

            <div className="avatar" title={user?.email || ""}>
              {initialsFromUser(user)}
            </div>

            <button className="btn btnGhost" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pageCard">
          <div className="pageHead">
            <div className="pageTitle">{title}</div>
            <div className="pageMeta">
              Signed in as <b>{user?.email || user?.username || "user"}</b>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
