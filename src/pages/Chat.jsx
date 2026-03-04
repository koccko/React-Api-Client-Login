import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import { verifySession } from "../lib/api.js";

export default function Chat() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      setChecking(true);
      const s = await verifySession();
      if (!s.ok) return nav("/login", { replace: true });
      setUser(s.user);
      setChecking(false);
    })();
  }, [nav]);

  if (checking) return null;

  return (
    <AppShell user={user} title="Chat">
      <div className="card cardPad">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Chat</div>
        <div className="muted" style={{ marginTop: 6 }}>
          Следващата стъпка: WebSocket / SSE за live messages + rooms.
        </div>
      </div>
    </AppShell>
  );
}
