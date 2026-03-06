import { useEffect, useState } from "react";
import TicketForm from "../components/TicketForm.jsx";
import TicketList from "../components/TicketList.jsx";
import TicketView from "../components/TicketView.jsx";
import {
  addComment,
  createTicket,
  getTicket,
  listTickets,
  updateTicketStatus,
} from "../tickets.js";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setError("");
      const data = await listTickets();
      const items = Array.isArray(data) ? data : data?.items || [];
      setTickets(items);

      if (!selectedId && items.length > 0) {
        setSelectedId(items[0].id);
      }
    } catch (e) {
      setError(e?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId) => {
    if (!ticketId) {
      setSelectedTicket(null);
      return;
    }

    try {
      setDetailsLoading(true);
      const data = await getTicket(ticketId);
      setSelectedTicket(data);
    } catch (e) {
      setError(e?.message || "Failed to load ticket details");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadTicketDetails(selectedId);
  }, [selectedId]);

  const handleCreateTicket = async (payload) => {
    try {
      setError("");
      const created = await createTicket(payload);
      await loadTickets();

      if (created?.id) {
        setSelectedId(created.id);
      }
    } catch (e) {
      setError(e?.message || "Failed to create ticket");
    }
  };

  const handleAddComment = async (ticketId, message) => {
    try {
      setError("");
      await addComment(ticketId, { message });
      await loadTicketDetails(ticketId);
      await loadTickets();
    } catch (e) {
      setError(e?.message || "Failed to add comment");
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      setError("");
      await updateTicketStatus(ticketId, { status });
      await loadTicketDetails(ticketId);
      await loadTickets();
    } catch (e) {
      setError(e?.message || "Failed to update ticket status");
    }
  };

  return (
    <div className="tickets-page">
      <div className="tickets-grid">
        <aside className="tickets-sidebar glass-card">
          <div className="section-head">
            <h2>Tickets</h2>
            <p>Manage and track requests</p>
          </div>

          <TicketForm onCreate={handleCreateTicket} />

          {error ? <div className="error-box">{error}</div> : null}

          {loading ? (
            <div className="empty-state">Loading tickets...</div>
          ) : (
            <TicketList
              tickets={tickets}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </aside>

        <main className="tickets-main glass-card">
          {detailsLoading ? (
            <div className="empty-state">Loading ticket details...</div>
          ) : selectedTicket ? (
            <TicketView
              ticket={selectedTicket}
              onAddComment={handleAddComment}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="empty-state">Select a ticket to view details</div>
          )}
        </main>
      </div>
    </div>
  );
}
