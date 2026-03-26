import { prisma } from "../config/db.js";
import { Prisma } from "@prisma/client";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            
            include: { 
                products: true // Take all the products of each category
            },
        });

        res.status(200).json({
            status: "success",
            data: categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch categories" });
    }
};

export const getCategorybyId = async (req, res) => {
    
}




            // USE WHEN CREATE DROPDOWN MENU IN FRONTEND
            // FOR SHOW CATEGORIES AND SUBCATEGORIES
export const getCatalogMenu = async (req, res) => {
    try {
        const menu = await prisma.category.findMany({
            where: {
                parentId: null // Берем только топ-уровень (Food, Electronics...)
            },
            include: {
                subCategories: true // Подтягиваем вложенные (Macarons, Café...)
            }
        });

        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при загрузке меню" });
    }
};