import express from 'express';
import dotenv from 'dotenv';
import rateLimiter from './middleware/reateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import { initializeDB } from './config/initDB.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(rateLimiter);
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
