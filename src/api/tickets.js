import { apiFetch } from "./http";

// 👇 Смени endpoints според бекенда на колегата
export const TicketsAPI = {
  list: () => apiFetch("/api/tickets"),
  get: (id) => apiFetch(`/api/tickets/${id}`),
  create: (payload) =>
    apiFetch("/api/tickets", { method: "POST", body: payload }),
  addComment: (id, payload) =>
    apiFetch(`/api/tickets/${id}/comments`, { method: "POST", body: payload }),
  updateStatus: (id, payload) =>
    apiFetch(`/api/tickets/${id}/status`, { method: "PUT", body: payload }),
};
