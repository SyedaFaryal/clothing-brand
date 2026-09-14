import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/api.js";
import { useCart } from "../context/CartContext.jsx";
import ColorSwatch from "../components/ColorSwatch.jsx";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | adding | added | buying | error

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p);
        setColor(p.colors?.[0] || null);
        setSize(null);
        setActiveImage(0);
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="container">
        <div className="alert-error" style={{ margin: "40px 0" }}>
          Couldn't load this product. It may not exist, or the backend isn't
          reachable.
        </div>
        <Link to="/" className="btn">
          ← Back to collection
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <p className="eyebrow" style={{ padding: "80px 0" }}>
          Loading product…
        </p>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [FALLBACK_IMAGE];
  const colors = product.colors || [];
  const sizes = product.sizes?.length ? product.sizes : ["One Size"];

  const doAdd = () =>
    addItem({
      productId: product._id,
      color: color?.name || "Default",
      size: size || sizes[0],
      quantity: 1,
    });

  const handleAdd = async () => {
    if (!size) return;
    setStatus("adding");
    try {
      await doAdd();
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleBuyNow = async () => {
    if (!size) return;
    setStatus("buying");
    try {
      await doAdd();
      navigate("/cart");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="pdp">
      <div className="container pdp-inner">
        <div className="pdp-gallery">
          <div className="pdp-gallery-main">
            <img src={images[activeImage]} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="pdp-gallery-thumbs">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  className={`pdp-thumb ${activeImage === i ? "pdp-thumb-active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <Link to="/" className="eyebrow back-link">
            ← Back to collection
          </Link>
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name || "Untitled product"}</h1>
          <span className="price price-lg">${Number(product.price ?? 0).toFixed(2)}</span>
          <p className="pdp-desc">{product.description}</p>

          {colors.length > 0 && (
            <div className="pdp-option-block">
              <span className="eyebrow">Color — {color?.name}</span>
              <ColorSwatch colors={colors} selected={color} onSelect={setColor} size="lg" />
            </div>
          )}

          <div className="pdp-option-block">
            <span className="eyebrow">Size {!size && "— select one"}</span>
            <div className="size-row">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={`size-chip ${size === s ? "size-chip-active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-button-row">
            <button
              className="btn btn-outline btn-block"
              onClick={handleAdd}
              disabled={!size || status === "adding" || status === "buying"}
            >
              {status === "adding" && "Adding…"}
              {status === "added" && "Added to Bag ✓"}
              {(status === "idle" || status === "error") && (size ? "Add to Bag" : "Select a size")}
              {status === "buying" && "Add to Bag"}
            </button>
            <button
              className="btn btn-block"
              onClick={handleBuyNow}
              disabled={!size || status === "adding" || status === "buying"}
            >
              {status === "buying" ? "Redirecting…" : "Buy Now"}
            </button>
          </div>

          <div className="pdp-meta">
            <span className="eyebrow">In stock: {product.stock ?? "—"}</span>
            <span className="eyebrow">Rating: {product.rating ?? "—"} / 5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
