import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/api.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getCart();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async ({ productId, color, size, quantity = 1 }) => {
      const data = await api.addToCart({ productId, color, size, quantity });
      setItems(data);
      setIsOpen(true);
    },
    []
  );

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const data = await api.updateCartItem(itemId, quantity);
    setItems(data);
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const data = await api.removeCartItem(itemId);
    setItems(data);
  }, []);

  const clearCart = useCallback(async () => {
    const data = await api.clearCart();
    setItems(data);
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        count,
        subtotal,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
