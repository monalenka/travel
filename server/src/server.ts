import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import toursRoutes from './routes/tours.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/tours', toursRoutes);

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: process.env.DISABLE_DB === 'true' ? 'disabled' : 'connected'
    });
});

app.get('/api/test', (_req, res) => {
    res.json({
        message: 'API is working!',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`🗄️ Database: ${process.env.DISABLE_DB === 'true' ? 'DISABLED (using mock data)' : 'ENABLED'}`);
});