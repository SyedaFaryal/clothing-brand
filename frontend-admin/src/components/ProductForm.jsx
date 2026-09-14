import { useEffect, useState } from "react";

const emptyProduct = {
  name: "",
  category: "Clothing",
  subCategory: "",
  price: "",
  description: "",
  images: [""],
  colors: [{ name: "", hex: "#14140F" }],
  sizes: [""],
  stock: 0,
  isNew: false,
};

export default function ProductForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    if (initial) {
      setForm({
        ...emptyProduct,
        ...initial,
        images: initial.images?.length ? initial.images : [""],
        colors: initial.colors?.length ? initial.colors : [{ name: "", hex: "#14140F" }],
        sizes: initial.sizes?.length ? initial.sizes : [""],
      });
    } else {
      setForm(emptyProduct);
    }
  }, [initial]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateListItem = (field, index, value) => {
    const list = [...form[field]];
    list[index] = value;
    update(field, list);
  };

  const updateColor = (index, key, value) => {
    const colors = [...form.colors];
    colors[index] = { ...colors[index], [key]: value };
    update("colors", colors);
  };

  const addListItem = (field, blank) => update(field, [...form[field], blank]);
  const removeListItem = (field, index) =>
    update(field, form[field].filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.map((i) => i.trim()).filter(Boolean),
      colors: form.colors.filter((c) => c.name.trim() && c.hex.trim()),
      sizes: form.sizes.map((s) => s.trim()).filter(Boolean),
    };
    onSave(payload);
  };

  return (
    <div className="modal-scrim">
      <form className="modal-card" onSubmit={handleSubmit}>
        <div className="modal-head">
          <h2>{initial ? "Edit Product" : "Add New Product"}</h2>
          <button type="button" className="drawer-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row-2">
            <div>
              <label>Item Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Oversized Wool Coat"
              />
            </div>
            <div>
              <label>Price ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div>
              <label>Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                <option value="Clothing">Clothing</option>
                <option value="Shoes">Shoes</option>
                <option value="Makeup">Makeup</option>
              </select>
            </div>
            <div>
              <label>Sub-category</label>
              <input
                value={form.subCategory}
                onChange={(e) => update("subCategory", e.target.value)}
                placeholder="e.g. Outerwear, Sneakers, Lips"
              />
            </div>
          </div>

          <div>
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div>
            <label>Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
          </div>

          <div className="checkbox-row">
            <input
              id="isNew"
              type="checkbox"
              style={{ width: "auto" }}
              checked={form.isNew}
              onChange={(e) => update("isNew", e.target.checked)}
            />
            <label htmlFor="isNew" style={{ margin: 0 }}>
              Mark as New Arrival
            </label>
          </div>

          {/* Images */}
          <div className="dynamic-field-block">
            <label>Image URLs</label>
            {form.images.map((img, i) => (
              <div className="dynamic-row" key={i}>
                <input
                  value={img}
                  onChange={(e) => updateListItem("images", i, e.target.value)}
                  placeholder="https://…"
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => removeListItem("images", i)}
                  disabled={form.images.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => addListItem("images", "")}
            >
              + Add Image URL
            </button>
          </div>

          {/* Colors */}
          <div className="dynamic-field-block">
            <label>Colors</label>
            {form.colors.map((c, i) => (
              <div className="dynamic-row" key={i}>
                <input
                  value={c.name}
                  onChange={(e) => updateColor(i, "name", e.target.value)}
                  placeholder="Color name e.g. Ink Black"
                />
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => updateColor(i, "hex", e.target.value)}
                  style={{ width: 52, padding: 4 }}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => removeListItem("colors", i)}
                  disabled={form.colors.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => addListItem("colors", { name: "", hex: "#14140F" })}
            >
              + Add Color
            </button>
          </div>

          {/* Sizes */}
          <div className="dynamic-field-block">
            <label>Sizes</label>
            {form.sizes.map((s, i) => (
              <div className="dynamic-row" key={i}>
                <input
                  value={s}
                  onChange={(e) => updateListItem("sizes", i, e.target.value)}
                  placeholder="e.g. M, 9, 30ml"
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => removeListItem("sizes", i)}
                  disabled={form.sizes.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => addListItem("sizes", "")}
            >
              + Add Size
            </button>
          </div>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving…" : initial ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
