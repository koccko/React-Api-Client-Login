import { apiFetch } from "./http.js";

export async function login(email, password) {
  return apiFetch("/api/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function getMe() {
  return apiFetch("/api/user", {
    method: "GET",
  });
}

export async function logout() {
  return apiFetch("/api/logout", {
    method: "POST",
  });
}
