import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import Chat from "./pages/Chat.jsx";

import { apiFetch } from "./api/http.js";

function FullscreenLoading({ text = "Loading..." }) {
  return (
    <div className="bg">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div
        className="shell"
        style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
      >
        <div style={{ opacity: 0.8 }}>{text}</div>
      </div>
    </div>
  );
}

function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      setChecking(true);

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const u = await apiFetch("/user", { timeoutMs: 6000 });
          if (!alive) return;
          setUser(u);
          setChecking(false);
          return;
        } catch {
          if (!alive) return;
          if (attempt === 1) {
            await sleep(350);
            continue;
          }
          setUser(null);
          setChecking(false);
          return;
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (checking) return <FullscreenLoading text="Checking session…" />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" replace /> : <Login />}
        />

        {/* Protected */}
        <Route
          path="/home"
          element={
            <RequireAuth user={user}>
              <Home user={user} />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth user={user}>
              <Dashboard user={user} />
            </RequireAuth>
          }
        />

        <Route
          path="/tickets"
          element={
            <RequireAuth user={user}>
              <TicketsPage user={user} />
            </RequireAuth>
          }
        />

        <Route
          path="/chat"
          element={
            <RequireAuth user={user}>
              <Chat user={user} />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
