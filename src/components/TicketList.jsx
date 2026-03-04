export default function TicketList({ tickets, onSelect, selectedId }) {
  return (
    <div
      style={{ border: "1px solid #333", borderRadius: 10, overflow: "hidden" }}
    >
      <div
        style={{ padding: 10, fontWeight: 700, borderBottom: "1px solid #333" }}
      >
        Tickets
      </div>
      <div>
        {tickets.length === 0 && (
          <div style={{ padding: 10, opacity: 0.7 }}>No tickets</div>
        )}
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: 12,
              border: "none",
              borderBottom: "1px solid #333",
              background:
                String(t.id) === String(selectedId)
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700 }}>
              {t.title || `Ticket #${t.id}`}
            </div>
            <div style={{ opacity: 0.8, fontSize: 12 }}>
              {t.status || "open"} • {t.priority || "normal"} •{" "}
              {t.created_at || ""}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
