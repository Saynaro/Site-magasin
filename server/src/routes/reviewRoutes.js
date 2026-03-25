import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewControllers.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Everyone can see the review, even not logged in
// URL: /reviews/:productId
router.get('/:productId', getProductReviews);

// Create the review - just if logged in
router.post('/', authMiddleware, createReview);

export default router;