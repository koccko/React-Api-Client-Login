import { apiFetch } from "./http.js";

export function listRooms() {
  return apiFetch("/api/chat/rooms");
}

export function listMessages(roomId) {
  return apiFetch(`/api/chat/rooms/${roomId}/messages`);
}

export function sendMessage(roomId, text) {
  return apiFetch(`/api/chat/rooms/${roomId}/messages`, {
    method: "POST",
    body: { text },
  });
}
