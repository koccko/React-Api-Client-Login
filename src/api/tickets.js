import { apiFetch } from "./http";

export const TicketsAPI = {
  list: () => apiFetch("/tickets"),

  get: (id) => apiFetch(`/tickets/${id}`),

  create: (payload) => apiFetch("/tickets", { method: "POST", body: payload }),

  addComment: (id, payload) =>
    apiFetch(`/tickets/${id}/comments`, { method: "POST", body: payload }),

  updateStatus: (id, payload) =>
    apiFetch(`/tickets/${id}/status`, { method: "PUT", body: payload }),
};
