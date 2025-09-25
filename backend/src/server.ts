import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

import morgan from 'morgan';
import healthRoutes from './routes/health';
import uploadRoutes from './routes/upload';
import { cleanupOldFiles } from './services/storage';
import { globalErrorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

// Middleware
app.use(cors());
app.use(express.json());
// Logging in dev mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Cleanup Job (Every 1 hour)
setInterval(async () => {
    try {
        const deleted = await cleanupOldFiles();
        if (deleted > 0) console.log(`Cleaned up ${deleted} old files`);
    } catch (e) {
        console.error('Cleanup failed:', e);
    }
}, 60 * 60 * 1000);

// Run cleanup on startup too
cleanupOldFiles().catch(console.error);

// Routes
app.use('/health', healthRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/', (req: Request, res: Response) => {
    res.redirect('/health');
});

// Handle unhandled routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
