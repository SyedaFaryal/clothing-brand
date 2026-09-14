const BASE_URL = "/api";

// A per-browser id so the backend can keep a separate cart per visitor
// without requiring login. Persisted in localStorage.
function getSessionId() {
  let id = localStorage.getItem("noir_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("noir_session_id", id);
  }
  return id;
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-session-id": getSessionId(),
      ...options.headers,
    },
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }
  return json.data;
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request(`/products/categories`),

  getCart: () => request(`/cart`),
  addToCart: (payload) =>
    request(`/cart`, { method: "POST", body: JSON.stringify(payload) }),
  updateCartItem: (itemId, quantity) =>
    request(`/cart/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (itemId) =>
    request(`/cart/${itemId}`, { method: "DELETE" }),
  clearCart: () => request(`/cart`, { method: "DELETE" }),

  createOrder: (payload) =>
    request(`/orders`, { method: "POST", body: JSON.stringify(payload) }),
};
