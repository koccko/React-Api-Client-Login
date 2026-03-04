import { apiFetch } from "../api/http.js";

export const API = {
  verify: "/api/user", // ако е /api/me -> смени тук
  login: "/api/login",
  logout: "/api/logout",

  // когато колегата даде реален endpoint -> смени BASE
  ticketsBase: "/api/tickets",
};

export async function verifySession() {
  try {
    const user = await apiFetch(API.verify);
    return { ok: true, user };
  } catch {
    return { ok: false, user: null };
  }
}
