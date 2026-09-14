const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("noir_admin_token");
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }
  return json.data ?? json;
}

export const api = {
  login: (email, password) =>
    request(`/auth/login`, { method: "POST", body: JSON.stringify({ email, password }) }),
  forgotPassword: (email) =>
    request(`/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email, appUrl: window.location.origin }),
    }),
  resetPassword: (token, password) =>
    request(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  getStats: () => request(`/admin/stats`),
  getSales: (period) => request(`/admin/sales?period=${period}`),
  getUsers: () => request(`/admin/users`),

  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (payload) =>
    request(`/products`, { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  getOrders: () => request(`/orders`),
  getOrder: (id) => request(`/orders/${id}`),
};
