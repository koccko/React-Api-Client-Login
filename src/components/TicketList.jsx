function chipStyle(kind, value) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid #2a2a2a",
    background: "#141414",
    color: "#eaeaea",
    whiteSpace: "nowrap",
  };

  if (kind === "priority") {
    const v = String(value || "normal").toLowerCase();
    if (v === "urgent")
      return { ...base, borderColor: "#5a1a1a", background: "#1a0f0f" };
    if (v === "high")
      return { ...base, borderColor: "#5a3b1a", background: "#1a140f" };
    if (v === "low")
      return { ...base, borderColor: "#1a5a2a", background: "#0f1a12" };
    return { ...base, borderColor: "#2a2a2a", background: "#141414" };
  }

  if (kind === "status") {
    const v = String(value || "open").toLowerCase();
    if (v === "closed" || v === "done" || v === "resolved")
      return { ...base, borderColor: "#1a5a2a", background: "#0f1a12" };
    if (v === "in_progress" || v === "progress")
      return { ...base, borderColor: "#1a3b5a", background: "#0f141a" };
    return { ...base, borderColor: "#3b3b3b", background: "#141414" };
  }

  return base;
}

function fmtDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}

export default function TicketList({ tickets, onSelect, selectedId }) {
  return (
    <div
      style={{
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        overflow: "hidden",
        background: "#0f0f0f",
        color: "#fff",
      }}
    >
      <div
        style={{
          padding: 12,
          fontWeight: 700,
          borderBottom: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Tickets</span>
        <span style={{ fontSize: 12, opacity: 0.7 }}>{tickets.length}</span>
      </div>

      <div style={{ maxHeight: 520, overflow: "auto" }}>
        {tickets.length === 0 && (
          <div style={{ padding: 12, opacity: 0.7 }}>No tickets</div>
        )}

        {tickets.map((t) => {
          const isActive = String(t.id) === String(selectedId);

          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: 12,
                border: "none",
                borderBottom: "1px solid #1f1f1f",
                background: isActive ? "rgba(79,70,229,0.14)" : "transparent",
                cursor: "pointer",
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 700, flex: 1 }}>
                  {t.title || `Ticket #${t.id}`}
                </div>

                <span style={chipStyle("status", t.status)}>
                  {t.status || "open"}
                </span>
                <span style={chipStyle("priority", t.priority)}>
                  {t.priority || "normal"}
                </span>
              </div>

              <div style={{ opacity: 0.75, fontSize: 12, marginTop: 6 }}>
                #{t.id} • {fmtDate(t.created_at)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
