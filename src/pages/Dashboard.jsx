import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell.jsx";
import { TicketsAPI } from "../api/tickets.js";

function statusNormalize(s) {
  const v = String(s || "").toLowerCase();
  if (v.includes("open")) return "Open";
  if (v.includes("progress") || v.includes("work")) return "In Progress";
  if (v.includes("resolved") || v.includes("done")) return "Resolved";
  if (v.includes("closed")) return "Closed";
  return s || "—";
}

function extractTickets(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.tickets)) return data.tickets;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export default function Dashboard({ user }) {
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState("");

  const loadTickets = async () => {
    setTicketsLoading(true);
    setTicketsError("");

    try {
      const data = await TicketsAPI.list();
      setTickets(extractTickets(data));
    } catch (err) {
      setTickets([]);
      setTicketsError(
        `Tickets fetch failed (${err?.status || "?"}) at ${err?.url || "?"} — ${err?.message || ""}`,
      );
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const counts = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0,
      Other: 0,
    };
    for (const t of tickets) {
      const st = statusNormalize(t?.status);
      if (counts[st] !== undefined) counts[st] += 1;
      else counts.Other += 1;
    }
    return counts;
  }, [tickets]);

  return (
    <AppShell user={user} title="Dashboard">
      <div className="card cardPad">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 18 }}>Ticket Dashboard</div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span className="pill">Open: {stats.Open}</span>
            <span className="pill">In Progress: {stats["In Progress"]}</span>
            <span className="pill">Resolved: {stats.Resolved}</span>
            <span className="pill">Closed: {stats.Closed}</span>
          </div>
        </div>

        {ticketsError && (
          <div style={{ marginTop: 10 }} className="error">
            {ticketsError}
          </div>
        )}

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th className="th">#</th>
              <th className="th">Title</th>
              <th className="th">Status</th>
              <th className="th">Priority</th>
              <th className="th">Created</th>
            </tr>
          </thead>
          <tbody>
            {ticketsLoading ? (
              <tr>
                <td className="td" colSpan={5} style={{ opacity: 0.75 }}>
                  Loading tickets…
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td className="td" colSpan={5} style={{ opacity: 0.75 }}>
                  No tickets yet.
                </td>
              </tr>
            ) : (
              tickets.slice(0, 30).map((t, idx) => (
                <tr key={t?.id ?? idx}>
                  <td className="td">{t?.id ?? idx + 1}</td>
                  <td className="td">{t?.title ?? t?.subject ?? "—"}</td>
                  <td className="td">
                    <span className="pill">{statusNormalize(t?.status)}</span>
                  </td>
                  <td className="td">
                    <span className="pill">{t?.priority ?? "—"}</span>
                  </td>
                  <td className="td" style={{ opacity: 0.85 }}>
                    {t?.created_at
                      ? String(t.created_at).slice(0, 19).replace("T", " ")
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div
          style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <button
            className="btn btnGhost"
            onClick={loadTickets}
            disabled={ticketsLoading}
          >
            {ticketsLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className="btn btnPrimary"
            onClick={() => alert("Next: Create ticket modal")}
          >
            + New Ticket (next)
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="card cardPad">
        <div style={{ fontWeight: 800 }}>Signed in</div>
        <div style={{ opacity: 0.85, marginTop: 6 }}>
          {user?.name || user?.full_name || user?.email || "—"}
        </div>
      </div>
    </AppShell>
  );
}
