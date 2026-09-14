import Product from "../models/Product.js";

// ---- Public ----

export const getProducts = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category && category !== "All") filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { subCategory: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, data: products });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: product });
};

export const getCategories = async (req, res) => {
  const categories = await Product.distinct("category");
  res.json({ success: true, data: ["All", ...categories] });
};

// ---- Admin (protected) ----

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: { id: req.params.id } });
};
