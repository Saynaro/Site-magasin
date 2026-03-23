import app from './app.js';
import { connectDB, disconnectDB } from './db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // connection to database
        await connectDB();

        // Start Express
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Handling shutdown signals (Ctrl+C / Docker stop)
        const gracefulShutdown = async () => {
            console.log('Shutting down gracefully...');
            await disconnectDB();
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        };

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);

        } catch (err) {
            console.error('Error starting server:', err);
            process.exit(1);
        }
};

startServer();