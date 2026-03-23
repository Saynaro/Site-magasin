import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Pool connection via standart driver PostgreSQL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Prisma init with adapter pg
const prisma = new PrismaClient({
    adapter,    // <-- The changement in Prisma 7
    log: process.env.NODE_ENV === "development" 
        ? ["query", "error", "warn"] 
        : ["error"]
});

const connectDB = async () => {
    try {
        // IN Prisma 7 recomended verify pool connection 
        await pool.query('SELECT 1'); 
        console.log("🐘 DataBase connected via Prisma 7 Adapter!");
    } catch (error) {
        console.error(
            "❌ DataBase connection error:",
            error instanceof Error ? error.message : error
        );
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
    await pool.end(); // IMPORTANT to close pg driver's pool 
};

export { prisma, connectDB, disconnectDB };