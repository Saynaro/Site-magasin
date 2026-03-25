import { prisma } from "../config/db.js";
import { Prisma } from "@prisma/client";

        // --- FOR USERS ---
// 1. Create order (CheckOut)
export const createOrder = async (req, res) => {
    try {
        const userId = Number(req.user.id);

        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: "Your cart is empty" });
        }

        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (item.product.priceCents * item.quantity);
        }, 0);

        const result = await prisma.$transaction(async (tx) => {
            // Create order with items inside
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: "PAID", 
                    items: {
                        create: cartItems.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.priceCents, // Fixed price when buy product
                            variant: item.variant
                        }))
                    }
                },
                include: { items: true }
            });

            // Remove everything from cart
            await tx.cartItem.deleteMany({ where: { userId } });

            return order;
        });
        
        res.status(201).json({ 
            status: "success",
            data: result 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Order creation failed" 
        });
    }
    
};





                    /// 2. TAKE MY ORDERS (ORDER HISTORY)
export const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: Number(req.user.id) },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Error fetching orders" });
    }
};






// --- FOR ADMIN  ---

// 3. take all the orders of ALL THE USERS
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { 
                    select: { 
                        name: true, email: true 
                    } 
                },
                items: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Fetch all orders failed" });
    }
};




// 4. Change the STATUS of order 
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body; // status: "SHIPPED", "DELIVERED", "CANCELLED"
        
        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { status }
        });

        res.json({ status: "success", data: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: "Status update failed" });
    }
};