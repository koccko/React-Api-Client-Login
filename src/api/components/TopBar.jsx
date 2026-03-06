import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

function getGreeting(hour) {
  if (hour < 12) return "Добро утро";
  if (hour < 18) return "Добър ден";
  return "Добър вечер";
}

function formatNow(date) {
  const days = [
    "Неделя",
    "Понеделник",
    "Вторник",
    "Сряда",
    "Четвъртък",
    "Петък",
    "Събота",
  ];

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return {
    day: days[date.getDay()],
    date: `${dd}.${mm}.${yyyy}`,
    time: `${hh}:${min}:${ss}`,
    greeting: getGreeting(date.getHours()),
  };
}

export default function TopBar({ user, onLogout }) {
  const [now, setNow] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const info = useMemo(() => formatNow(now), [now]);

  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  const initial = String(displayName).trim().charAt(0).toUpperCase();

  const handleLogout = async () => {
    setMenuOpen(false);
    await onLogout?.();
  };

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-badge" />
        <div>
          <div className="brand-title">IT Team Portal</div>
          <div className="brand-subtitle">BY IT DEV TEAM</div>
        </div>
      </div>

      <nav className="navbar">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          🎫 Tickets
        </NavLink>

        <NavLink
          to="/chat"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          💬 Chat
        </NavLink>
      </nav>

      <div className="topbar-right">
        <div className="timebox">
          <div className="time-pill">{info.day}</div>
          <div className="time-pill">{info.date}</div>
          <div className="time-pill">{info.time}</div>
        </div>

        <div className="user-area">
          <div className="greeting">
            {info.greeting}, <strong>{displayName}</strong>
          </div>

          <div className="avatar-wrap" ref={menuRef}>
            <button
              className="avatar-btn"
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              {initial}
            </button>

            <div className={`avatar-menu ${menuOpen ? "open" : ""}`}>
              <div className="avatar-card">
                <div className="avatar-big">{initial}</div>
                <div>
                  <div className="avatar-name">{displayName}</div>
                  <div className="avatar-role">
                    {user?.role || user?.position || "IT"}
                  </div>
                </div>
              </div>

              <button className="menu-btn" type="button" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
