import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { showProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productControllers.js";

const router = express.Router();

router.get("/", showProducts);

router.post("/create", authMiddleware, adminMiddleware, createProduct);

router.patch("/update/:id", authMiddleware, adminMiddleware, updateProduct);

router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);


export default router;

