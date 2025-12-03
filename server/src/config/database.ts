import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travel_booking';

        if (process.env.DISABLE_DB === 'true') {
            console.log('⚠️ MongoDB connection disabled (DISABLE_DB=true)');
            return;
        }

        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected');

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:',
            error instanceof Error ? error.message : 'Unknown error');

        console.log('⚠️ Continuing without database connection');
    }
};