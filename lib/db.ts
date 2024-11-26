// lib/mongoose.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "";

const dbConnect = async () => {
    if (mongoose.connection.readyState === 1) {
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
