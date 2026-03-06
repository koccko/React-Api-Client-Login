import { useMemo, useState } from "react";

function normalizeStatus(status) {
  const value = String(status || "open").toLowerCase();

  if (value.includes("prog")) return "progress";
  if (value.includes("clos")) return "closed";
  return "open";
}

export default function TicketView({ ticket, onComment, onStatus, busy }) {
  const [message, setMessage] = useState("");

  const status = useMemo(() => normalizeStatus(ticket?.status), [ticket]);

  if (!ticket) {
    return (
      <div className="card">
        <div className="view-empty">
          Избери тикет от списъка, за да видиш детайли, коментари и действия.
        </div>
      </div>
    );
  }

  const sendComment = async () => {
    const clean = message.trim();
    if (!clean) return;

    await onComment(ticket.id, clean);
    setMessage("");
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">
            {ticket.title || `Ticket #${ticket.id}`}
          </div>
          <div className="ticket-meta">
            <span>#{ticket.id}</span>
            <span>•</span>
            <span>{ticket.priority || "normal"}</span>
          </div>
        </div>

        <span className={`pill ${status}`}>{status}</span>
      </div>

      <div className="card-body">
        <div className="view-section">
          <div className="section-label">Description</div>
          <div className="description-box">{ticket.description || "—"}</div>
        </div>

        <div className="view-section" style={{ marginTop: 16 }}>
          <div className="section-label">Status</div>

          <div className="button-row">
            <button
              className="secondary-btn"
              type="button"
              onClick={() => onStatus(ticket.id, "open")}
              disabled={busy}
            >
              Open
            </button>

            <button
              className="secondary-btn"
              type="button"
              onClick={() => onStatus(ticket.id, "progress")}
              disabled={busy}
            >
              Progress
            </button>

            <button
              className="secondary-btn"
              type="button"
              onClick={() => onStatus(ticket.id, "closed")}
              disabled={busy}
            >
              Closed
            </button>
          </div>
        </div>

        <div className="view-section" style={{ marginTop: 16 }}>
          <div className="section-label">Comments</div>

          <div className="comments-wrap">
            {(ticket.comments || []).length ? (
              ticket.comments.map((comment, index) => (
                <div className="comment-box" key={index}>
                  <div className="comment-head">
                    <div className="comment-author">
                      {comment.author || "User"}
                    </div>
                    <div className="comment-time">
                      {comment.created_at || ""}
                    </div>
                  </div>
                  <div>{comment.message || comment.text || ""}</div>
                </div>
              ))
            ) : (
              <div className="description-box">Няма коментари.</div>
            )}
          </div>

          <div className="composer">
            <input
              className="input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendComment();
                }
              }}
            />

            <button
              className="primary-btn"
              type="button"
              onClick={sendComment}
              disabled={busy}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
