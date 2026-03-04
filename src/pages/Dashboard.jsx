import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, fetchTicketsAuto, verifySession, API } from "../lib/api.js";

function initialsFromUser(user) {
  const name = user?.name || user?.full_name || user?.email || "IT";
  const parts = String(name)
    .split(/[\s@._-]+/)
    .filter(Boolean);
  const a = (parts[0] || "I")[0];
  const b = (parts[1] || "T")[0];
  return (a + b).toUpperCase();
}

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

export default function Dashboard() {
  const nav = useNavigate();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState("");
  const [ticketsEndpoint, setTicketsEndpoint] = useState("");

  const loadTickets = useMemo(() => {
    return async () => {
      setTicketsLoading(true);
      setTicketsError("");
      setTicketsEndpoint("");

      const r = await fetchTicketsAuto();

      if (!r.ok) {
        setTickets([]);
        setTicketsError(
          `Tickets fetch failed (${r.error?.status || "?"}) at ${r.error?.url || "?"} — ${r.error?.message || ""}`,
        );
        setTicketsLoading(false);
        return;
      }

      setTicketsEndpoint(r.urlTried);
      setTickets(extractTickets(r.data));
      setTicketsLoading(false);
    };
  }, []);

  useEffect(() => {
    (async () => {
      setChecking(true);
      const s = await verifySession();
      if (!s.ok) {
        nav("/login", { replace: true });
        return;
      }
      setUser(s.user);
      setChecking(false);

      await loadTickets();
    })();
  }, [nav, loadTickets]);

  const logout = async () => {
    try {
      await apiFetch(API.logout, { method: "POST" });
    } catch {}
    nav("/", { replace: true });
  };

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

  if (checking) {
    return (
      <div className="bg">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div
          className="shell"
          style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
        >
          <div style={{ opacity: 0.8 }}>Loading dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <div className="shell">
        <div className="dashTop">
          <div className="brand">IT TEAM</div>
          <div className="sub">Tickets</div>

          <div style={{ marginLeft: 12 }}>
            <div className="badge-dev">🚧 В процес на разработка :)</div>
          </div>

          <div className="right">
            <div className="avatar" title={user?.email || user?.name || ""}>
              {initialsFromUser(user)}
            </div>
            <button className="btn btnGhost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginTop: 14 }} className="gridHero">
          <div className="card cardPad">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                Ticket Dashboard
              </div>

              <div style={{ opacity: 0.65, fontSize: 12 }}>
                Trying: <code>{API.ticketsCandidates.join(" , ")}</code>
              </div>

              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span className="pill">Open: {stats.Open}</span>
                <span className="pill">
                  In Progress: {stats["In Progress"]}
                </span>
                <span className="pill">Resolved: {stats.Resolved}</span>
                <span className="pill">Closed: {stats.Closed}</span>
              </div>
            </div>

            {ticketsEndpoint && (
              <div style={{ marginTop: 10, opacity: 0.75, fontSize: 12 }}>
                ✅ Tickets endpoint used: <code>{ticketsEndpoint}</code>
              </div>
            )}

            {ticketsError && (
              <div style={{ marginTop: 10 }} className="error">
                {ticketsError}
              </div>
            )}

            <table className="table">
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
                      No tickets yet (or endpoint not wired).
                    </td>
                  </tr>
                ) : (
                  tickets.slice(0, 30).map((t, idx) => (
                    <tr key={t?.id ?? idx}>
                      <td className="td">{t?.id ?? idx + 1}</td>
                      <td className="td">{t?.title ?? t?.subject ?? "—"}</td>
                      <td className="td">
                        <span className="pill">
                          {statusNormalize(t?.status)}
                        </span>
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
              style={{
                marginTop: 12,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button className="btn btnGhost" onClick={loadTickets}>
                Refresh
              </button>
              <button
                className="btn btnPrimary"
                onClick={() => alert("Next: Create ticket modal")}
              >
                + New Ticket (next)
              </button>
            </div>
          </div>

          <div className="statsCol">
            <div className="stat">
              <div className="statLabel">User</div>
              <div className="statValue">
                {user?.name || user?.full_name || user?.email || "—"}
              </div>
              <div className="statHint">Session verified via {API.verify}</div>
            </div>

            <div className="stat">
              <div className="statLabel">API</div>
              <div className="statValue">/api/*</div>
              <div className="statHint">credentials: include • proxy</div>
            </div>

            <div className="stat">
              <div className="statLabel">Next step</div>
              <div className="statValue">CRUD</div>
              <div className="statHint">
                Create ticket, comments, status changes, filters
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
