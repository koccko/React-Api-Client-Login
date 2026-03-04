import { useEffect, useState } from "react";
import AppShell from "../components/AppShell.jsx";
import TicketForm from "../components/TicketForm.jsx";
import TicketList from "../components/TicketList.jsx";
import TicketView from "../components/TicketView.jsx";
import { TicketsAPI } from "../api/tickets.js";

function extractList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.tickets)) return data.tickets;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export default function TicketsPage({ user }) {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [error, setError] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const loadList = async () => {
    setError("");
    setLoadingList(true);
    try {
      const data = await TicketsAPI.list();
      const list = extractList(data);
      setTickets(list);

      // keep selection consistent
      if (list.length && !selectedId) {
        setSelectedId(list[0]?.id ?? null);
      }
    } catch (e) {
      setTickets([]);
      setError(e?.message || "Failed to load tickets");
    } finally {
      setLoadingList(false);
    }
  };

  const loadTicket = async (id) => {
    if (!id) return;
    setError("");
    setLoadingTicket(true);
    try {
      const t = await TicketsAPI.get(id);
      setSelectedTicket(t?.data || t);
    } catch (e) {
      setSelectedTicket(null);
      setError(e?.message || "Failed to load ticket");
    } finally {
      setLoadingTicket(false);
    }
  };

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedId) loadTicket(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const createTicket = async (payload) => {
    setError("");
    try {
      const created = await TicketsAPI.create(payload);
      await loadList();

      const id = created?.id || created?.data?.id;
      if (id) setSelectedId(id);
    } catch (e) {
      setError(e?.message || "Failed to create ticket");
      throw e;
    }
  };

  const addComment = async (payload) => {
    if (!selectedId) return;
    setError("");
    try {
      await TicketsAPI.addComment(selectedId, payload);
      await loadTicket(selectedId);
    } catch (e) {
      setError(e?.message || "Failed to add comment");
      throw e;
    }
  };

  const updateStatus = async (payload) => {
    if (!selectedId) return;
    setError("");
    try {
      await TicketsAPI.updateStatus(selectedId, payload);
      await loadTicket(selectedId);
      await loadList();
    } catch (e) {
      setError(e?.message || "Failed to update status");
      throw e;
    }
  };

  return (
    <AppShell user={user} title="Tickets">
      {error && (
        <div style={{ marginBottom: 12 }} className="error">
          Error: {error}
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 14 }}
      >
        {/* LEFT */}
        <div style={{ display: "grid", gap: 14 }}>
          <TicketForm onCreate={createTicket} />

          <div className="card cardPad">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 900 }}>Inbox</div>

              <button
                className="btn btnGhost"
                onClick={loadList}
                disabled={loadingList}
                style={{ marginLeft: "auto" }}
              >
                {loadingList ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <TicketList
              tickets={tickets}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {loadingTicket ? (
            <div className="card cardPad" style={{ opacity: 0.8 }}>
              Loading ticket…
            </div>
          ) : (
            <TicketView
              ticket={selectedTicket}
              onAddComment={addComment}
              onUpdateStatus={updateStatus}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
