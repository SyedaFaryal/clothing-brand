import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ColorSwatch from "./ColorSwatch.jsx";
import { useCart } from "../context/CartContext.jsx";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const colors = product.colors || [];
  const images = product.images?.length ? product.images : [FALLBACK_IMAGE];

  const [color, setColor] = useState(colors[0] || null);
  const [busy, setBusy] = useState(""); // "" | "adding" | "buying"

  const addToCart = () => {
    const size = product.sizes?.[0] || "One Size";
    return addItem({
      productId: product._id,
      color: color?.name || "Default",
      size,
      quantity: 1,
    });
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy("adding");
    try {
      await addToCart();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy("");
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy("buying");
    try {
      await addToCart();
      navigate("/cart");
    } catch (err) {
      console.error(err);
    } finally {
      setBusy("");
    }
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-media">
        <img src={images[0]} alt={product.name || "Product"} loading="lazy" />
        <img src={images[1] || images[0]} alt="" className="product-card-media-hover" />
        {product.isNew && <span className="tag-new">New</span>}

        <div className="card-action-row">
          <button
            className="quick-add-btn"
            onClick={handleQuickAdd}
            disabled={busy !== ""}
          >
            {busy === "adding" ? "Adding…" : "Add to Cart"}
          </button>
          <button
            className="buy-now-btn"
            onClick={handleBuyNow}
            disabled={busy !== ""}
          >
            {busy === "buying" ? "…" : "Buy Now"}
          </button>
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-card-row">
          <h3>
            <Link to={`/product/${product._id}`}>{product.name || "Untitled product"}</Link>
          </h3>
          <span className="price">${Number(product.price ?? 0).toFixed(2)}</span>
        </div>
        <span className="eyebrow">{product.category || ""}</span>

        {colors.length > 0 && (
          <ColorSwatch colors={colors} selected={color} onSelect={setColor} />
        )}
      </div>
    </article>
  );
}
