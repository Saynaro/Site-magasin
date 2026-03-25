import { prisma } from "../config/db.js";
import { Prisma } from "@prisma/client";

        // show banners
export const getActiveBanners = async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            where: { isActive: true }
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch banners" });
    }
};




        // --- FOR ADMIN add new banner ---
export const createBanner = async (req, res) => {
    try {
        const { title, imageUrl, link } = req.body;
        const banner = await prisma.banner.create({
            data: { title, imageUrl, link }
        });
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ error: "Create banner failed" });
    }
};