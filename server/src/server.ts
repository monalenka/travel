import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from './models/Tour.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const checkAdminAccess = (req: express.Request): boolean => {
    const token = req.headers['x-admin-token'] as string;
    return token === process.env.ADMIN_PASSWORD;
};

const connectDB = async () => {
    try {
        if (process.env.DISABLE_DB !== 'true') {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nice-tours');
            console.log('✅ MongoDB connected');
        } else {
            console.log('⚠️ Database connection disabled');
        }
    } catch (error) {
        console.log('⚠️ Continuing without database connection');
    }
};

const mockTours = [
    {
        id: '1',
        title: 'Monaco & Monte-Carlo Half-Day Tour',
        description: 'Experience luxury and glamour on this half-day tour to Monaco and Monte Carlo.',
        price: 89,
        duration: 'Half Day (5 hours)',
        groupSize: 'Small Group (max 8)',
        categories: ['small-group', 'private'],
        isPopular: true,
        rating: 4.9,
        coverImage: 'images/monaco-tour.jpg'
    },
    {
        id: '2',
        title: 'Cannes & Antibes Full Day Tour',
        description: 'Discover the glamour of Cannes and the charm of Antibes.',
        price: 129,
        duration: 'Full Day (9 hours)',
        groupSize: 'Small Group (max 8)',
        categories: ['small-group'],
        isPopular: true,
        rating: 4.8,
        coverImage: 'images/cannes-tour.jpg'
    }
];

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Nice Tours Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.get('/api/tours', async (req, res) => {
    try {
        const { category, popular } = req.query;
        let filter: any = { isActive: true };

        if (category) {
            filter.categories = { $in: [category] };
        }

        if (popular === 'true') {
            filter.isPopular = true;
        }

        const tours = await Tour.find(filter)
            .select('title description basePrice duration groupSize coverImage isPopular rating slug')
            .lean();

        res.json({
            success: true,
            data: tours,
            count: tours.length
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tours'
        });
    }
});

app.get('/api/tours/:id', async (req, res) => {
    try {
        const tour = await Tour.findOne({
            $or: [
                { _id: req.params.id },
                { slug: req.params.id }
            ],
            isActive: true
        }).lean();

        if (tour) {
            res.json({
                success: true,
                data: tour
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Tour not found'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tour'
        });
    }
});

app.get('/api/admin/status', (req, res) => {
    const isAdmin = checkAdminAccess(req);
    res.json({
        success: true,
        isAdmin
    });
});

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
        res.json({
            success: true,
            message: 'Admin access granted',
            token: password
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid password'
        });
    }
});


app.get('/api/tours/categories', (_req, res) => {
    const categories = [
        { id: 'small-group', name: 'Small Group Tours' },
        { id: 'private', name: 'Private Tours' },
        { id: 'shore-excursion', name: 'Shore Excursions' },
        { id: 'destination', name: 'Our Destinations' }
    ];

    res.json({
        success: true,
        data: categories
    });
});

app.get('/api/tours/slug/:slug', (req, res) => {
    const tour = mockTours.find(t => t.id === req.params.slug);

    if (tour) {
        res.json({
            success: true,
            data: tour
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Tour not found'
        });
    }
});

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`
    ╔═══════════════════════════════════════════╗
    ║        Nice Tours Server Started!         ║
    ╚═══════════════════════════════════════════╝
    🌐 Local: http://localhost:${PORT}
    📊 Health: http://localhost:${PORT}/api/health
    🗄️  Database: ${process.env.DISABLE_DB === 'true' ? 'DISABLED' : 'ENABLED'}
    🔐 Admin Password: ${process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET'}
    `);
    });
};

startServer().catch(console.error);