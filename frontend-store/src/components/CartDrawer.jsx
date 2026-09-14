import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <>
      <div
        className={`drawer-scrim ${isOpen ? "drawer-scrim-visible" : ""}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}>
        <div className="cart-drawer-head">
          <span className="eyebrow">Your Bag ({items.length})</span>
          <button className="drawer-close" onClick={() => setIsOpen(false)} aria-label="Close cart">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your bag is empty.</p>
            <span className="eyebrow">Add something you'll actually wear.</span>
          </div>
        ) : (
          <div className="cart-drawer-items">
            {items.map((item) => (
              <div key={item.itemId} className="cart-item">
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
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
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
        )}

        {items.length > 0 && (
          <div className="cart-drawer-foot">
            <div className="product-card-row">
              <span className="eyebrow">Subtotal</span>
              <span className="price">${subtotal.toFixed(2)}</span>
            </div>
            <Link to="/cart" className="btn btn-block" onClick={() => setIsOpen(false)}>
              View Bag &amp; Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
