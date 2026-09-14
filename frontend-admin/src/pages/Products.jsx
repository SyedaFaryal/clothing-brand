import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import ProductForm from "../components/ProductForm.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const load = () => {
    setLoading(true);
    api
      .getProducts(categoryFilter !== "All" ? { category: categoryFilter } : {})
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [categoryFilter]);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing?._id) {
        await api.updateProduct(editing._id, payload);
      } else {
        await api.createProduct(payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.deleteProduct(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="page-head-row">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Add, edit, or remove items from the catalog.</p>
        </div>
        <button className="btn" onClick={() => setEditing({})}>
          + Add Product
        </button>
      </div>

      <div className="category-filters" style={{ marginBottom: 20 }}>
        {["All", "Clothing", "Shoes", "Makeup"].map((c) => (
          <button
            key={c}
            className={`chip ${categoryFilter === c ? "chip-active" : ""}`}
            onClick={() => setCategoryFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <p className="eyebrow">Loading products…</p>
      ) : (
        <div className="panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Colors</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.images[0]} alt="" className="table-thumb" />
                  </td>
                  <td>{p.name}</td>
                  <td>
                    <span className="eyebrow">{p.category}</span>
                  </td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    <div className="swatch-row">
                      {p.colors.map((c) => (
                        <span
                          key={c.hex}
                          className="swatch"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </td>
                  <td className={p.stock <= 5 ? "stock-warning" : ""}>{p.stock}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p style={{ padding: 20 }}>No products in this category yet.</p>}
        </div>
      )}

      {editing !== null && (
        <ProductForm
          initial={editing._id ? editing : null}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}
    </div>
  );
}
