import { v4 as uuidv4 } from "uuid";
import Product from "./Product.js";

// Simple in-memory cart store keyed by sessionId (sent as `x-session-id`
// header from the frontend). Good enough for a demo/single-instance app;
// swap for a per-user Mongo cart collection if you need it to persist
// across devices.
const carts = new Map();

class CartModel {
  static getOrCreate(sessionId) {
    if (!carts.has(sessionId)) {
      carts.set(sessionId, []);
    }
    return carts.get(sessionId);
  }

  static async addItem(sessionId, { productId, color, size, quantity = 1 }) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const cart = this.getOrCreate(sessionId);
    const existing = cart.find(
      (item) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        itemId: uuidv4(),
        productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color,
        size,
        quantity,
      });
    }

    return cart;
  }

  static updateQuantity(sessionId, itemId, quantity) {
    const cart = this.getOrCreate(sessionId);
    const item = cart.find((i) => i.itemId === itemId);
    if (!item) throw new Error("Cart item not found");
    item.quantity = Math.max(1, quantity);
    return cart;
  }

  static removeItem(sessionId, itemId) {
    const cart = this.getOrCreate(sessionId);
    const filtered = cart.filter((i) => i.itemId !== itemId);
    carts.set(sessionId, filtered);
    return filtered;
  }

  static clear(sessionId) {
    carts.set(sessionId, []);
    return [];
  }
}

export default CartModel;
