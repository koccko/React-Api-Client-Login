import AppShell from "../components/AppShell.jsx";

export default function Tickets({ user }) {
  return (
    <AppShell user={user} title="Tickets">
      <div className="card cardPad">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Tickets</div>
        <div className="muted" style={{ marginTop: 6 }}>
          Следващата стъпка: връзваме реалния endpoint за tickets и пълним UI:
          списък + детайли + коментари + смяна на статус.
        </div>
      </div>
    </AppShell>
  );
}
