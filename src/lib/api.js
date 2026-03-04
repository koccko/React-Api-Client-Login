import { apiFetch } from "../api/http.js";

/*
 Central API endpoints
 IMPORTANT: do NOT include /api here.
 http.js automatically prefixes /api and uses credentials: "include"
*/

export const API = {
  user: "/user",
  login: "/login",
  logout: "/logout",
};

/*
 Check if session cookie is valid
 Used mainly by App.jsx
*/
export async function verifySession() {
  try {
    const user = await apiFetch(API.user);
    return { ok: true, user };
  } catch (err) {
    if (err?.status === 401) {
      return { ok: false, user: null };
    }
    throw err;
  }
}

/*
 Optional helper if you want to logout from anywhere
*/
export async function logout() {
  try {
    await apiFetch(API.logout, { method: "POST" });
  } catch {
    // ignore errors
  }
}
