import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

import { addToCart, deleteFromCart, getMyCart,  } from '../controllers/cartControllers.js';

const router = express.Router();


// https://localhost:3000/cart/
router.get("/", authMiddleware, getMyCart);

// https://localhost:3000/cart/add
router.post("/add", authMiddleware, addToCart);

// https://localhost:3000/cart/delete
router.delete("/delete", authMiddleware, deleteFromCart);

export default router;

// authMiddleware always first