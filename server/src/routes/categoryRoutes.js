import express from 'express';
import { getCatalogMenu, getAllCategories } from '../controllers/categoryControllers.js';

const router = express.Router();

// Get catalog menu (categories with subcategories)
router.get('/menu', getCatalogMenu);

// Get all categories
router.get('/', getAllCategories);

export default router;
