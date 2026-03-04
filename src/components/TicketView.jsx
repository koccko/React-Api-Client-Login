import { useEffect, useMemo, useState } from "react";

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

function chip(label) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 12,
        border: "1px solid #2a2a2a",
        background: "#141414",
        color: "#eaeaea",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export default function TicketView({ ticket, onAddComment, onUpdateStatus }) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const [status, setStatus] = useState(ticket?.status || "open");
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    setStatus(ticket?.status || "open");
    setComment("");
    setSending(false);
    setStatusSaving(false);
  }, [ticket?.id]);

  const comments = useMemo(() => ticket?.comments || [], [ticket]);

  if (!ticket) {
    return (
      <div
        style={{
          border: "1px solid #2a2a2a",
          borderRadius: 12,
          padding: 16,
          background: "#0f0f0f",
          color: "#fff",
          opacity: 0.85,
        }}
      >
        Select a ticket to view details.
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;

    const msg = comment.trim();
    if (!msg) return;

    setSending(true);
    try {
      await onAddComment({ message: msg });
      setComment("");
    } finally {
      setSending(false);
    }
  };

  const changeStatus = async (next) => {
    setStatus(next);
    if (statusSaving) return;

    setStatusSaving(true);
    try {
      await onUpdateStatus({ status: next });
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: 16,
        background: "#0f0f0f",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 18, flex: 1 }}>
          {ticket.title || `Ticket #${ticket.id}`}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {chip(ticket.priority || "normal")}

          <select
            value={status}
            onChange={(e) => changeStatus(e.target.value)}
            disabled={statusSaving}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #2a2a2a",
              background: "#141414",
              color: "#fff",
              cursor: statusSaving ? "not-allowed" : "pointer",
            }}
            title="Update status"
          >
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="resolved">resolved</option>
            <option value="closed">closed</option>
          </select>
        </div>
      </div>

      <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
        #{ticket.id} • {fmtDate(ticket.created_at)}
        {statusSaving ? " • saving..." : ""}
      </div>

      <div
        style={{
          marginTop: 14,
          whiteSpace: "pre-wrap",
          lineHeight: 1.5,
          opacity: 0.95,
        }}
      >
        {ticket.description || "(no description)"}
      </div>

      <div style={{ marginTop: 18, fontWeight: 800 }}>Comments</div>

      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {comments.map((c) => (
          <div
            key={c.id ?? `${c.created_at}-${c.author}-${c.message}`}
            style={{
              padding: 12,
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              background: "#121212",
            }}
          >
            <div style={{ opacity: 0.75, fontSize: 12 }}>
              {c.author || c.user || "User"} • {fmtDate(c.created_at)}
            </div>
            <div style={{ marginTop: 6, lineHeight: 1.45 }}>
              {c.message || c.body || ""}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div style={{ opacity: 0.7 }}>No comments</div>
        )}
      </div>

      <form
        onSubmit={submit}
        style={{ marginTop: 14, display: "flex", gap: 10 }}
      >
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          disabled={sending}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #2a2a2a",
            background: "#141414",
            color: "#fff",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={sending || !comment.trim()}
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontWeight: 700,
            cursor: sending ? "not-allowed" : "pointer",
            opacity: sending || !comment.trim() ? 0.7 : 1,
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
