import { prisma } from "../config/db.js";
import { Prisma } from "@prisma/client";

// 1. Create review (USER)
export const createReview = async (req, res) => {
    try {
        const { productId, stars, text } = req.body;
        const userId = Number(req.user.id);

        // Check: stars from 1 to 5
        if (stars < 1 || stars > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }

        const review = await prisma.review.create({
            data: {
                productId,
                userId,
                stars: Number(stars),
                text
            },
            include: {
                user: { select: { name: true, avatar: true } } // Сразу вернем инфо об авторе
            }
        });

        res.status(201).json({ status: "success", data: review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to post review" });
    }
};





// 2. Take all the reviews for one product (PUBLIC)
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: { select: { name: true, avatar: true } }
            },
            orderBy: { created_at: 'desc' }
        });

        // Count average rating
        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length 
            : 0;

        res.json({ 
            status: "success", 
            average: avgRating.toFixed(1), 
            count: reviews.length,
            data: reviews 
        });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch reviews" });
    }
};