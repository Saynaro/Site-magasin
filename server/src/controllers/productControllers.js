import slugify from "slugify";
import { prisma } from "../config/db.js";
import { Prisma } from "@prisma/client";


                        //////// SHOW PRODUCTS BY CATEGORIES AND SUBCATEGORIES //////////
export const showProducts = async (req, res) => {
    try {
        const { categoryId, minPrice, maxPrice, sortBy, page = 1, limit = 9 } = req.query;
        
        let queryCondition = {};

        // --- SORT BY CATEGORY ---
        if (categoryId) {
            const id = Number(categoryId);

            // search category and her subcategory
            const categoryWithSubs = await prisma.category.findUnique({
                where: { id },
                include: { subCategories: { select: { id: true } } }
            });

            if (categoryWithSubs) {
                // Create Id list: parents and their childs
                const allCategoryIds = [
                    categoryWithSubs.id, 
                    ...categoryWithSubs.subCategories.map(sub => sub.id)
                ];

                // Prisma looks for items, where categories in that list
                queryCondition.categoryId = { in: allCategoryIds };
            }
        }



        if (minPrice || maxPrice) {
            queryCondition.priceCents = {};
            if (minPrice) queryCondition.priceCents.gte = Number(minPrice);
            if (maxPrice) queryCondition.priceCents.lte = Number(maxPrice);
        }

        // Sort logic by asc desc
        let orderCondition = { createdAt: 'desc' };
        if (sortBy === 'price_asc') orderCondition = { priceCents: 'asc' };
        else if (sortBy === 'price_desc') orderCondition = { priceCents: 'desc' };
        else if (sortBy === 'oldest') orderCondition = { createdAt: 'asc' };

        const p = Number(page);
        const l = Number(limit);

        const total = await prisma.product.count({ where: queryCondition });
        const products = await prisma.product.findMany({
            where: queryCondition,
            skip: (p - 1) * l,
            take: l,
            include: { category: { select: { name: true } } },
            orderBy: orderCondition,
        });

        if (products.length === 0) {
            return res.status(404).json({ error: "No products found!" });
        }

        res.status(200).json({
            products,
            totalPages: Math.ceil(total / l),
            currentPage: p,
            totalItems: total
        });
    } catch (error) {
        console.error(`ShowProducts Error: ${error}`);
        res.status(500).json({ error: "Server error!" });
    }
};




            //////// CREATE PRODUCT FOR ADMINS ONLY //////////

export const createProduct = async (req, res) => {
    try {
        const { name, description, priceCents, categoryId, image, images, variants, characteristics } = req.body;
        
        if (!name || !priceCents || !categoryId) {
            return res.status(400).json({ error: "Name, price and category are required" });
        };

        const generatedSlug = slugify(name, { lower: true, strict: true });

        // 2. Creation product in database
        const newProduct = await prisma.product.create({
            data: {
                name,
                slug: generatedSlug,
                description,
                priceCents: Number(priceCents),
                categoryId: Number(categoryId),
                image,
                // Arrays
                images: images || [], 
                variants: variants || [],
                characteristics: characteristics || []
            }
        });

        res.status(201).json({
            status: "success",
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {

        console.error("CREATE PRODUCT ERROR:", error);
        
        // slug duplicate verification
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                error: "Product with this slug already exists" 
            });
        }

        res.status(500).json({ 
            error: "Error creating product"
        });
    }
};




                        ///////// UPDATE PRODUCT FOR ADMINS ONLY //////////

export const updateProduct = async (req, res) => {
    try{
        const { id } = req.params;

        const { name, priceCents, categoryId, ...otherData } = req.body;

        let updateData = { ...otherData };

        if (name) {
                updateData.name = name;
                updateData.slug = slugify(name, { lower: true, strict: true });
        }

        if (priceCents) updateData.priceCents = Number(priceCents);
        if (categoryId) updateData.categoryId = Number(categoryId);

        const updatedProduct = await prisma.product.update({
                where: { id: id }, // id string or int 
                data: updateData
        });

        res.status(200).json({
                status: "success",
                message: "Product updated",
                data: updatedProduct
        });

    }catch (error) {
        console.error("UPDATE ERROR:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(500).json({ error: "Could not update product" });
    }
};


                ////////// DELETE PRODUCT FOR ADMINS ONLY   ////////////

                // AFTER WITH PROGRESSION OF PROJECT, BETTER TO DO prisma.product.update({ data: { isAvailable: false } })
                // BECAUSE IF I DELETE THE PRODUCT IT WILL BE DELETED EVEN FROM ORDERS TOO

export const deleteProduct = async (req, res) => {
    try{
        const { id } = req.params;

        const result = await prisma.product.delete({
            where: { id: id },
        });

        res.status(200).json({
            status: "success",
            message: "Product deleted successfully!"
        });
    } catch(error){
        console.error("DELETE ERROR:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(500).json({ error: "Could not delete product" });
    }
};