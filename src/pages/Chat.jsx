import AppShell from "../components/AppShell.jsx";

export default function Chat({ user }) {
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
