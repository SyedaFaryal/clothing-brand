import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api/api.js";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, loading, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerEmail: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const order = await api.createOrder(form);
      setConfirmedOrder(order);
      await clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p className="eyebrow" style={{ padding: "80px 0" }}>
          Loading bag…
        </p>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <section className="cart-page">
        <div className="container order-confirm">
          <span className="eyebrow">Order Confirmed</span>
          <h1>Thank you, {confirmedOrder.customerName.split(" ")[0]}.</h1>
          <p>
            Order <strong>#{confirmedOrder._id.slice(-6).toUpperCase()}</strong> has been placed
            for <strong>${confirmedOrder.total.toFixed(2)}</strong>. A confirmation has been sent
            to {confirmedOrder.customerEmail}.
          </p>
          <Link to="/" className="btn">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="container">
        <h1>Your Bag</h1>

        {items.length === 0 ? (
          <div className="cart-empty-page">
            <p>Your bag is empty.</p>
            <Link to="/" className="btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-page-grid">
            <div className="cart-page-items">
              {items.map((item) => (
                <div key={item.itemId} className="cart-item cart-item-lg">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <div className="product-card-row">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <span className="eyebrow">
                      {item.color} · Size {item.size}
                    </span>
                    <div className="qty-row">
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)}>
                        +
                      </button>
                      <button className="remove-link" onClick={() => removeItem(item.itemId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <span className="eyebrow">Order Summary</span>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {!checkingOut ? (
                <button className="btn btn-block" onClick={() => setCheckingOut(true)}>
                  Checkout
                </button>
              ) : (
                <form onSubmit={handlePlaceOrder} className="checkout-form">
                  {error && <div className="alert-error">{error}</div>}
                  <label>Full Name</label>
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                    placeholder="Jane Doe"
                  />
                  <label>Email</label>
                  <input
                    required
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                    placeholder="jane@example.com"
                  />
                  <button className="btn btn-block" type="submit" disabled={placing}>
                    {placing ? "Placing Order…" : `Place Order — $${total.toFixed(2)}`}
                  </button>
                </form>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
