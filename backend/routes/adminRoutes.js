import { Router } from "express";
import { getDashboardStats, getSalesReport, listUsers } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/sales", getSalesReport);
router.get("/users", listUsers);

export default router;
