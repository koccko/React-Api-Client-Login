import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./api/pages/LoginPage.jsx";
import TicketsPage from "./api/pages/TicketsPage.jsx";
import ChatPage from "./api/pages/ChatPage.jsx";
import InfoPage from "./api/pages/InfoPage.jsx";
import AppShell from "./api/components/AppShell.jsx";

import { getMe, login, logout } from "./api/auth.js";

function RequireAuth({ user, children }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

function AppInner() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");

  const loadMe = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setBooting(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const onLogin = async (email, password) => {
    setLoginBusy(true);
    setLoginError("");

    try {
      await login(email, password);
      const me = await getMe();
      setUser(me);
      navigate("/tickets", { replace: true });
    } catch (e) {
      setLoginError(e?.message || "Login failed");
    } finally {
      setLoginBusy(false);
    }
  };

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  if (booting) {
    return (
      <div className="boot-screen">
        <div className="loader-ring" />
        <div className="boot-title">Loading session...</div>
        <div className="boot-sub">BY IT DEV TEAM</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/tickets" replace />
          ) : (
            <LoginPage onLogin={onLogin} busy={loginBusy} error={loginError} />
          )
        }
      />

      <Route
        path="/tickets"
        element={
          <RequireAuth user={user}>
            <AppShell user={user} onLogout={onLogout}>
              <TicketsPage />
            </AppShell>
          </RequireAuth>
        }
      />

      <Route
        path="/chat"
        element={
          <RequireAuth user={user}>
            <AppShell user={user} onLogout={onLogout}>
              <ChatPage />
            </AppShell>
          </RequireAuth>
        }
      />

      <Route
        path="/info"
        element={
          <RequireAuth user={user}>
            <AppShell user={user} onLogout={onLogout}>
              <InfoPage user={user} />
            </AppShell>
          </RequireAuth>
        }
      />

      <Route
        path="*"
        element={<Navigate to={user ? "/tickets" : "/login"} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
