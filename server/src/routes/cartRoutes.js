import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { createBanner, deleteProduct } from '../controllers/adminController.js';

const router = express.Router();

// Маршруты, доступные ТОЛЬКО админам
// Сначала проверяем, что это ВООБЩЕ юзер, а потом — что он АДМИН
router.post('/banners', authMiddleware, adminMiddleware, createBanner);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;

// authMiddleware always first