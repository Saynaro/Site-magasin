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



                        ////// CHANGE THE QUANTITY: MAKE 5 OR 10 .... ////////

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = Number(req.user.id);

        const updated = await prisma.cartItem.update({
            where: {
                userId_productId: { userId, productId }
            },
            data: { quantity: Number(quantity) }
        });

        res.status(200).json({ status: "success", data: updated });
    } catch (error) {
        res.status(500).json({ error: "Update quantity error" });
    }
};


                //////// DELETE FROM CART ////////

export const deleteFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        // take from authMiddleware
        const userId = Number(req.user.id);

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
        const userId = Number(req.user.id);
        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
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

        // COUNT TOTAL CART PRICE
        const totalCartAmount = cartItems.reduce((acc, item) => {
            return acc + (item.product.priceCents * item.quantity);
        }, 0);

        res.status(200).json({
            status: "success",
            totalAmount: totalCartAmount,
            data: cartItems 
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error fetching cart" 
        });
    }
};

