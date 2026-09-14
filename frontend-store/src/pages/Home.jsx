import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .getProducts(activeCategory !== "All" ? { category: activeCategory } : {})
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setError(
          "Couldn't load products. Make sure the backend is running (npm run dev in /backend) and connected to MongoDB."
        );
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">Autumn / Winter Collection</span>
          <h1 className="hero-title">
            Style, from head
            <br />
            <em>to toe.</em>
          </h1>
          <p className="hero-copy">
            Honest fabrics, considered cuts, no noise. Clothing, footwear and
            makeup — NOIR &amp; CO makes the pieces you reach for first, season
            after season.
          </p>
          <a href="#shop" className="btn">
            Shop The Collection
          </a>
        </div>
      </section>

      <section id="shop" className="shop-section">
        <div className="container">
          <div className="shop-head">
            <h2>The Collection</h2>
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${activeCategory === cat ? "chip-active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="alert-error">{error}</div>}

          {loading ? (
            <div className="loading-state eyebrow">Loading collection…</div>
          ) : products.length === 0 && !error ? (
            <div className="loading-state eyebrow">
              No products found in this category yet.
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
