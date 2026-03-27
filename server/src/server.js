import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // connection to database
        await connectDB();

        // Start Express
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });

        // Handling shutdown signals (Ctrl+C / Docker stop)
        const gracefulShutdown = async () => {
            console.log('Signal for exit received. Starts closing...');

            const forceExitTimeout = setTimeout(() => {
                console.error('Shutdown timeout reached, forcing exit..');
                process.exit(1);
            }, 30000);

            // 1. Stop HTTP server before
            server.close(async () => {
                console.log('HTTP server closed. There is no new requests.');
                
                try {
                    // 2. Close Database just after closing server
                    await disconnectDB();
                    console.log('DATABASE connection closed successfully.');
                    
                    clearTimeout(forceExitTimeout);
                    process.exit(0);
                } catch (err) {
                    console.error('Error while exit DATABASE:', err);
                    process.exit(1);
                }
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