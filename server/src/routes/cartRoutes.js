import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

import { addToCart, deleteFromCart, getMyCart, updateCartItemQuantity } from '../controllers/cartControllers.js';

const router = express.Router();

router.use(authMiddleware);

// https://localhost:3000/cart/
router.get("/", getMyCart);

// https://localhost:3000/cart/add
router.post("/add", addToCart);

// https://localhost:3000/cart/update
router.patch('/update', updateCartItemQuantity);

// https://localhost:3000/cart/remove
router.delete("/remove", deleteFromCart);

export default router;

// authMiddleware always first