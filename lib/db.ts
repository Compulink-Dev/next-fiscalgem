// lib/mongoose.ts
import mongoose from 'mongoose';

// Check if process.env.MONGO_URI is defined, otherwise provide a default URI for local development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zimra';

const dbConnect = async () => {
    if (mongoose.connection.readyState === 1) {
        // If already connected, return the existing connection
        return mongoose.connection.asPromise();
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('MongoDB connection failed');
    }
};

export default dbConnect;
