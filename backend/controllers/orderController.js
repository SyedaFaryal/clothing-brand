import Order from "../models/Order.js";
import CartModel from "../models/Cart.js";

const getSessionId = (req) => req.headers["x-session-id"] || "guest";

// Customer checkout: turns the current session cart into a permanent Order
// document in MongoDB, then empties the cart.
export const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail } = req.body;
    if (!customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: "customerName and customerEmail are required",
      });
    }

    const sessionId = getSessionId(req);
    const cart = CartModel.getOrCreate(sessionId);
    if (cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 150 ? 0 : 8;

    const order = await Order.create({
      user: req.user?._id || null,
      customerName,
      customerEmail,
      items: cart.map((i) => ({
        product: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
        image: i.image,
      })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "paid",
    });

    CartModel.clear(sessionId);

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: list every order, most recent first.
export const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({ success: true, data: order });
};
