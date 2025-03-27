import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URI, {}); // No extra options needed

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
