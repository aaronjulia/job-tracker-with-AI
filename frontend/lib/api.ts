const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  // localStorage only exists in the browser, not during server rendering
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    // FastAPI returns errors as { "detail": "..." }
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.detail ?? message;
    } catch {
      // response body wasn't JSON; keep statusText
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T; // No Content (e.g. delete)
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export async function login(email: string, password: string): Promise<string> {
  // OAuth2 password flow expects form-encoded data, not JSON
  const body = new URLSearchParams();
  body.append("username", email); // the spec calls it "username"; we put email here
  body.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (res.status === 401) {
  localStorage.removeItem("token");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
  throw new Error("Session expired");
}

  if (!res.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await res.json();
  return data.access_token as string; // returns the JWT
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

