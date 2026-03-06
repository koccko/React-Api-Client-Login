let refreshPromise = null;

async function rawFetch(path, { method = "GET", body, headers } = {}) {
  const url = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return { res, data };
}

async function refreshToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { res, data } = await rawFetch("/api/token/refresh", {
        method: "POST",
      });

      if (!res.ok) {
        const message =
          typeof data === "object" && data?.message
            ? data.message
            : "Session expired";
        throw new Error(message);
      }

      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiFetch(path, options = {}) {
  const pathStr = String(path);

  let response = await rawFetch(path, options);

  const shouldTryRefresh =
    response.res.status === 401 &&
    !pathStr.includes("/api/login") &&
    !pathStr.includes("/api/logout") &&
    !pathStr.includes("/api/token/refresh");

  if (shouldTryRefresh) {
    await refreshToken();
    response = await rawFetch(path, options);
  }

  if (!response.res.ok) {
    const message =
      typeof response.data === "object" && response.data?.message
        ? response.data.message
        : `HTTP ${response.res.status}`;

    const error = new Error(message);
    error.status = response.res.status;
    error.data = response.data;
    throw error;
  }

  return response.data;
}
