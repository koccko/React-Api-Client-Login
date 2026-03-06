function normalizeStatus(status) {
  const value = String(status || "open").toLowerCase();

  if (value.includes("prog")) return "progress";
  if (value.includes("clos")) return "closed";
  return "open";
}

export default function TicketList({
  tickets,
  selectedId,
  onSelect,
  filter,
  setFilter,
  search,
  setSearch,
}) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Tickets</div>

        <div className="toolbar">
          <input
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{ width: 180 }}
          />

          <select
            className="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 140 }}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="progress">Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="ticket-list">
        {(tickets || []).map((ticket) => {
          const status = normalizeStatus(ticket.status);
          const active = String(ticket.id) === String(selectedId);

          return (
            <button
              key={ticket.id}
              className={`ticket-item ${active ? "active" : ""}`}
              onClick={() => onSelect(ticket)}
              type="button"
            >
              <div className="ticket-top">
                <div className="ticket-title">
                  {ticket.title || `Ticket #${ticket.id}`}
                </div>

                <span className={`pill ${status}`}>{status}</span>
              </div>

              <div className="ticket-meta">
                <span>#{ticket.id}</span>
                <span>•</span>
                <span>{ticket.priority || "normal"}</span>
                {ticket.created_at ? (
                  <>
                    <span>•</span>
                    <span>{ticket.created_at}</span>
                  </>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
