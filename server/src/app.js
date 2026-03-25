import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { prisma } from './config/db.js';

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

config();
const app = express()

app.use(cookieParser());

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? false // In production,  If front and back in one domain, we put "false" or site adresse
        : ["http://127.0.0.1:5500", "http://localhost:5500"], 
    credentials: true,
}));


app.use(express.json());  // Middleware to parse JSON bodies from incoming requests
app.use(express.urlencoded({ extended: true }));      // Middleware to parse URL-encoded bodies (like form in html)


app.use("/auth", authRoutes);       // All routes defined in authRoutes will be prefixed with /auth

app.use("/products", productRoutes);

app.use("/cart", cartRoutes);







// // JUST FOR CHECK THE SERVER IS WORKING
// app.get('/health', async (req, res) => {
//     try {
//         // Make the empty request via Prisma
//         // In Prisma 7 it will go into adapter
//         const result = await prisma.$queryRaw`SELECT NOW() as now`; 
        
//         res.json({ 
//             status: 'ok', 
//             server_time: result[0].now, // in Prisma result — it is object array
//             message: 'All systems operational via Prisma Client' 
//         });
//     } catch (err) {
//         console.error('Prisma Health check failed:', err);
//         res.status(500).json({ status: 'error', message: err.message });
//     }
// });

export default app;