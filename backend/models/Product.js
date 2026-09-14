import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Clothing", "Shoes", "Makeup"],
    },
    subCategory: { type: String, trim: true, default: "" }, // e.g. "Outerwear", "Sneakers", "Lipstick"
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    images: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length > 0,
      required: true,
    },
    colors: { type: [colorSchema], default: [] },
    sizes: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    isNew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", category: "text" });

export default mongoose.model("Product", productSchema);
