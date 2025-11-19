// Centralized API + WS URL builders and simple client helpers

function getApiBase() {
  try {
    // Avoid TS type issues if vite types aren't loaded
    const env = (import.meta as any)?.env;
    return env?.VITE_API_BASE_URL || "/api";
  } catch {
    return "/api";
  }
}
const API_BASE = getApiBase();

function getWsProtocol() {
  if (typeof window === "undefined") return "ws";
  return window.location.protocol === "https:" ? "wss" : "ws";
}

function getHost() {
  if (typeof window === "undefined") return "localhost";
  return window.location.host;
}

export const endpoints = {
  // Auth
  login: () => `${API_BASE}/auth/login`,
  me: () => `${API_BASE}/auth/me`,
  verify: () => `${API_BASE}/auth/verify`,

  // Occupancy
  occupancy: (cameraId: string) => `${API_BASE}/occupancy/${cameraId}`,
  occupancyWs: (cameraId: string, token: string) =>
    `${getWsProtocol()}://${getHost()}/api/occupancy/${cameraId}/ws?token=${encodeURIComponent(
      `Bearer ${token}`
    )}`,

  // Video (uses Sec-WebSocket-Protocol header via subprotocols)
  videoProcessedWs: (cameraId: string) =>
    `${getWsProtocol()}://${getHost()}/api/video/${cameraId}/processed`,
  videoRawWs: (cameraId: string) =>
    `${getWsProtocol()}://${getHost()}/api/video/${cameraId}/raw`,
};

export async function apiPost<TBody extends object, TResp = any>(
  url: string,
  body: TBody,
  opts?: { token?: string }
): Promise<TResp> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return (await res.json()) as TResp;
}

export async function apiGet<TResp = any>(
  url: string,
  opts?: { token?: string }
): Promise<TResp> {
  const res = await fetch(url, {
    headers: {
      ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return (await res.json()) as TResp;
}
