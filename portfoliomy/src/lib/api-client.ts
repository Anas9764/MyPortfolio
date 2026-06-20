const API_BASE = "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}/${endpoint.replace(/^\//, "")}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

export const login = (formData: { email: string; password: string }) =>
  request("auth/login", { method: "POST", body: JSON.stringify(formData) });

export const logout = () =>
  request("auth/logout", { method: "POST" });

export const getPortfolioData = () => request("portfolio/data");

export const updateBio = (data: object) =>
  request("portfolio/bio", { method: "POST", body: JSON.stringify(data) });

export const getAnalytics = () => request("portfolio/analytics/stats");

export const getMessages = () => request("portfolio/messages");

export const deleteMessage = (id: string) =>
  request(`portfolio/messages/${id}`, { method: "DELETE" });

export const replyMessage = (data: object) =>
  request("portfolio/messages/reply", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const addItem = (type: string, data: object) =>
  request(`portfolio/${type}`, { method: "POST", body: JSON.stringify(data) });

export const updateItem = (type: string, id: string, data: object) =>
  request(`portfolio/${type}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteItem = (type: string, id: string) =>
  request(`portfolio/${type}/${id}`, { method: "DELETE" });

export const reorderItems = (
  type: string,
  orders: { _id: string; priority: number }[]
) =>
  request(`portfolio/${type}/reorder`, {
    method: "POST",
    body: JSON.stringify({ orders }),
  });

export const uploadImage = async (formData: FormData) => {
  const res = await fetch(`${API_BASE}/portfolio/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || "Upload failed");
  }
  return res.json();
};

export const trackVisit = () =>
  request("portfolio/analytics/track", { method: "POST" });

export const sendMessage = (data: object) =>
  request("portfolio/messages", { method: "POST", body: JSON.stringify(data) });
