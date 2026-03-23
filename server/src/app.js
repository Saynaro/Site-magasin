import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { config } from "dotenv";


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

export default app;