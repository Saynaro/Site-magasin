import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/orderControllers.js";

const router = express.Router();

router.use(authMiddleware);

// https://localhost:3000/order/checkout
router.post('/checkout', createOrder);

// https://localhost:3000/order/my
router.get('/my', getMyOrders);

// --- ADMIN ENDPOINTS ---
// https://localhost:3000/order/admin/all
router.get('/admin/all', adminMiddleware, getAllOrders);

// https://localhost:3000/order/admin/status
router.patch('/admin/status', adminMiddleware, updateOrderStatus);

export default router;