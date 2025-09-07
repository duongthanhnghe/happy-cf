import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nuxtapp';
        await mongoose.connect(mongoUri, {
            // optional config
            autoIndex: true,
        });
        console.log('✅ MongoDB connected:', mongoUri);
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=database.js.map