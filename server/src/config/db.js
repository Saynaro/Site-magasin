import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log:
    process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"]
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DataBase connected via prisma!");
    } catch (error) {
        console.log(
            "DataBase connection error:",
            error instanceof Error ? error.message : error
        );
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };