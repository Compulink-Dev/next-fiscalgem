import mongoose from 'mongoose';

// Event listeners for mongoose connection
mongoose.connection.on('connected', () => {
    console.log("MongoDB connected successfully");
});

mongoose.connection.on('error', (err) => {
    console.error("MongoDB connection error:", err);
});

mongoose.connection.on('disconnected', () => {
    console.warn("MongoDB disconnected");
});

// Maximum retries for connection attempts
const MAX_RETRIES = 3;

// Delay between retries in milliseconds
const RETRY_DELAY_MS = 5000;

// MongoDB connection function
export async function dbConnect() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in the environment variables');
        return; // Return early without throwing
    }

    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB is already connected");
            return;
        }

        // Retry logic for connecting to MongoDB
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                await mongoose.connect(process.env.MONGODB_URI, {
                    connectTimeoutMS: 10000, // Timeout in milliseconds
                });
                console.log("MongoDB connection established");
                return; // Exit function on successful connection
            } catch (error) {
                console.log(error);

                retries++;
                console.warn(`Retrying MongoDB connection (${retries}/${MAX_RETRIES})...`);
                if (retries === MAX_RETRIES) {
                    console.error('Max retries reached. Failed to connect to MongoDB.');
                    break; // Break the loop instead of throwing
                }
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS)); // Wait before retrying
            }
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

// Graceful shutdown for handling app termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed on app termination');
        process.exit(0);
    } catch (error) {
        console.error('Error during MongoDB shutdown:', error);
        process.exit(1);
    }
});
