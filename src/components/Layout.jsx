import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { apiFetch } from "../api/http.js";

export default function Layout({ title, children }) {
  const nav = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = useMemo(() => {
    return async () => {
      if (loggingOut) return;
      setLoggingOut(true);

      try {
        await apiFetch("/logout", { method: "POST" }); // -> /api/logout via http.js
      } catch {
        // ignore
      } finally {
        setLoggingOut(false);
        nav("/login", { replace: true });
      }
    };
  }, [nav, loggingOut]);

  return (
    <div
      style={{
        padding: 28,
        fontFamily: "Arial",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>

        <button
          onClick={onLogout}
          style={{ marginLeft: "auto" }}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
