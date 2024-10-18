// lib/mongoose.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zimra';

const dbConnect = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    }
    return mongoose.connect(MONGO_URI);
};

export default dbConnect;
