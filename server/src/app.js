import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { prisma } from './config/db.js';

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

config();
const app = express()

app.use(cookieParser());


const allowedOrigins = [
    'https://site-magasin.vercel.app',                  // Main address (removed trailing slash)
    /\.vercel\.app$/,                                   // All Vercel preview versions
    /\.github\.io$/,                                    // GitHub Pages
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:5501', 
    'http://127.0.0.1:5501',
    'http://localhost:3000',
    'http://localhost:5173'                             // Vite port standard
];

app.use(cors({
    origin: function (origin, callback) {
        // ALLOW METHODS WITHOUT ORIGIN
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(pattern => {
            return pattern instanceof RegExp ? pattern.test(origin) : pattern === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin); // IF ADRESSE CHANGE
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    // ADD ALL THE STANDART METHODS
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    // ADD STANDART AND CUSTOM HEADERS
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    // FOR HOW MANY SECOND BROWSER CAN "CASH" this permission
    maxAge: 86400 
}));


app.use(express.json());  // Middleware to parse JSON bodies from incoming requests
app.use(express.urlencoded({ extended: true }));      // Middleware to parse URL-encoded bodies (like form in html)


app.use("/auth", authRoutes);       // All routes defined in authRoutes will be prefixed with /auth

app.use("/products", productRoutes);

app.use("/cart", cartRoutes);

app.use("/orders", orderRoutes);

app.use("/banners", bannerRoutes);

app.use("/reviews", reviewRoutes);

app.use("/categories", categoryRoutes);




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