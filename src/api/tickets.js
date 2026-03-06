import { apiFetch } from "./http.js";

export function listTickets() {
  return apiFetch("/api/tickets");
}

export function createTicket(payload) {
  return apiFetch("/api/tickets", {
    method: "POST",
    body: payload,
  });
}

export function getTicket(id) {
  return apiFetch(`/api/tickets/${id}`);
}

export function addComment(id, message) {
  return apiFetch(`/api/tickets/${id}/comment`, {
    method: "POST",
    body: { message },
  });
}

export function updateTicketStatus(id, status) {
  return apiFetch(`/api/tickets/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}
