export const API = {
  verify: "/api/user", // if yours is /api/me -> change here
  login: "/api/login",
  logout: "/api/logout",

  // We'll try these in order until one works (200)
  ticketsCandidates: [
    "/api/tickets",
    "/api/tickets/index",
    "/api/tickets/list",
    "/api/ticket",
    "/tickets",
  ],
};

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  return { res, data, url };
}

export async function verifySession() {
  const { res, data } = await apiFetch(API.verify);
  return { ok: res.ok, user: data };
}

export async function fetchTicketsAuto() {
  let lastErr = null;

  for (const url of API.ticketsCandidates) {
    try {
      const { res, data } = await apiFetch(url);
      if (res.ok) return { ok: true, urlTried: url, data };

      // keep the last error but continue trying next
      lastErr = {
        url,
        status: res.status,
        message: data?.message || res.statusText || "Request failed",
      };
    } catch (e) {
      lastErr = { url, status: 0, message: e?.message || "Network error" };
    }
  }

  return {
    ok: false,
    error: lastErr || {
      url: "unknown",
      status: 0,
      message: "No endpoints worked",
    },
  };
}
