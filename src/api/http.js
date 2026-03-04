// src/api/http.js
const DEFAULT_TIMEOUT_MS = 8000;

export async function apiFetch(
  path,
  { method = "GET", body, headers, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
  // Ensure the request always goes through Vite proxy: /api -> http://192.168.10.5:80
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.startsWith("/api/") && p !== "/api") p = `/api${p}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(p, {
      method,
      credentials: "include",
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json")
      ? await res.json().catch(() => ({}))
      : await res.text();

    if (!res.ok) {
      const msg =
        typeof data === "object" && data?.message
          ? data.message
          : `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      err.url = p;
      throw err;
    }

    return data;
  } catch (err) {
    if (err?.name === "AbortError") {
      const e = new Error(`Request timeout after ${timeoutMs}ms`);
      e.status = 0;
      e.url = p;
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
