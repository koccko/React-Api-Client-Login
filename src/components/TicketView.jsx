import { useState } from "react";

export default function TicketView({ ticket, onAddComment, onUpdateStatus }) {
  const [comment, setComment] = useState("");
  if (!ticket) return <div style={{ opacity: 0.7 }}>Select a ticket</div>;

  const submit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddComment({ message: comment });
    setComment("");
  };

  return (
    <div style={{ border: "1px solid #333", borderRadius: 10, padding: 12 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{ticket.title}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <select
            value={ticket.status || "open"}
            onChange={(e) => onUpdateStatus({ status: e.target.value })}
            style={{ padding: 8 }}
          >
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="resolved">resolved</option>
            <option value="closed">closed</option>
          </select>
        </div>
      </div>

      <div style={{ opacity: 0.8, marginTop: 6 }}>
        #{ticket.id} • {ticket.priority || "normal"} • {ticket.created_at || ""}
      </div>

      <div style={{ marginTop: 14, whiteSpace: "pre-wrap" }}>
        {ticket.description || "(no description)"}
      </div>

      <div style={{ marginTop: 16, fontWeight: 700 }}>Comments</div>
      <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
        {(ticket.comments || []).map((c) => (
          <div
            key={c.id}
            style={{ padding: 10, border: "1px solid #333", borderRadius: 10 }}
          >
            <div style={{ opacity: 0.75, fontSize: 12 }}>
              {c.author || ""} {c.created_at || ""}
            </div>
            <div style={{ marginTop: 6 }}>{c.message || c.body || ""}</div>
          </div>
        ))}
        {(ticket.comments || []).length === 0 && (
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
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
