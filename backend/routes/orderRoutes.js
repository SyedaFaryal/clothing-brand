import { Router } from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// Checkout is open to guests; if a valid token is sent we attach req.user
// but we don't hard-require login here to keep guest checkout working.
router.post("/", createOrder);

// Admin only
router.get("/", protect, adminOnly, getOrders);
router.get("/:id", protect, adminOnly, getOrderById);

export default router;
