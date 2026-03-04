import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import TicketView from "../components/TicketView";
import { TicketsAPI } from "../api/tickets";

export default function TicketsPage({ onLogout }) {
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
      // очакваме масив; ако бекенда връща {data:[...]} — смени тук
      setTickets(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingList(false);
    }
  };

  const loadTicket = async (id) => {
    setError("");
    setLoadingTicket(true);
    try {
      const t = await TicketsAPI.get(id);
      setSelectedTicket(t.data || t); // ако е wrap-нато
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingTicket(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (selectedId) loadTicket(selectedId);
  }, [selectedId]);

  const createTicket = async (payload) => {
    setError("");
    try {
      const created = await TicketsAPI.create(payload);
      await loadList();
      const id = created?.id || created?.data?.id;
      if (id) setSelectedId(id);
    } catch (e) {
      setError(e.message);
    }
  };

  const addComment = async (payload) => {
    if (!selectedId) return;
    setError("");
    try {
      await TicketsAPI.addComment(selectedId, payload);
      await loadTicket(selectedId);
    } catch (e) {
      setError(e.message);
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
      setError(e.message);
    }
  };

  return (
    <Layout title="IT TEAM TICKETS" onLogout={onLogout}>
      {error && (
        <div style={{ color: "#dc2626", marginBottom: 12 }}>Error: {error}</div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 14 }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <TicketForm onCreate={createTicket} />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 700 }}>Inbox</div>
              <button
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

        <div>
          {loadingTicket ? (
            <div style={{ opacity: 0.7 }}>Loading ticket...</div>
          ) : (
            <TicketView
              ticket={selectedTicket}
              onAddComment={addComment}
              onUpdateStatus={updateStatus}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
