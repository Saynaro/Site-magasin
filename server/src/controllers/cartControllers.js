import { prisma } from "../config/db.js";
import { Prisma } from "@prisma/client";

export const addToCart = async (req, res) => {
    try{
    const { productId, quantity, variant } = req.body;

    console.log("User from middleware:", req.user);
    // take from authMiddleware
    const userId = Number(req.user.id);

    const cartItem = await prisma.cartItem.upsert({
        where: { 
            userId_productId: {
                    userId: userId,
                    productId: productId
                }
        }, 
        update: {
                // if item in cart add quantity
                quantity: { increment: Number(quantity) }
        },
        create: {
                // if no item - create
                userId: userId,
                productId: productId,
                quantity: Number(quantity),
                variant: variant || {}
            }
    });
    res.status(200).json({
        status: "success", data: cartItem 
    });

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not add to cart" });
    }
};



                //////// DELETE FROM CART ////////

export const deleteFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        // take from authMiddleware
        const userId = req.user.id;

        const result = await prisma.cartItem.deleteMany({
            where: { 
                userId: userId,
                productId: productId
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "Item not found in your cart" });
        }

        res.status(200).json({
            status: "success",
            message: "Item removed from cart",
            data: productId
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error on delete" 
        });
    }
};





                //////// SHOW CART ITEMS ///////
export const getMyCart = async (req, res) => {
    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: req.user.id },
            include: {
                product: {
                    select: {
                        name: true,
                        priceCents: true,
                        image: true,
                        slug: true
                    }
                }
            }
        })
        res.status(200).json({
            status: "success", data: cartItems 
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error fetching cart" 
        });
    }
}