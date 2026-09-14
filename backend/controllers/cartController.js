import CartModel from "../models/Cart.js";

// sessionId is passed by the frontend via the `x-session-id` header so each
// browser gets its own cart without needing full auth/login.
const getSessionId = (req) => req.headers["x-session-id"] || "guest";

export const getCart = (req, res) => {
  const cart = CartModel.getOrCreate(getSessionId(req));
  res.json({ success: true, data: cart });
};

export const addToCart = async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;
    if (!productId || !color || !size) {
      return res.status(400).json({
        success: false,
        message: "productId, color and size are required",
      });
    }
    const cart = await CartModel.addItem(getSessionId(req), {
      productId,
      color,
      size,
      quantity,
    });
    res.status(201).json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateCartItem = (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = CartModel.updateQuantity(
      getSessionId(req),
      req.params.itemId,
      Number(quantity)
    );
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const removeCartItem = (req, res) => {
  const cart = CartModel.removeItem(getSessionId(req), req.params.itemId);
  res.json({ success: true, data: cart });
};

export const clearCart = (req, res) => {
  const cart = CartModel.clear(getSessionId(req));
  res.json({ success: true, data: cart });
};
