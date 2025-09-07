// server/db/mongo.ts
import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "";
        if (!uri) {
            throw new Error("❌ MONGO_URI is not defined in .env");
        }
        await mongoose.connect(uri, {
        // Mongoose v7+ không cần useNewUrlParser, useUnifiedTopology nữa
        });
        console.log("✅ MongoDB connected successfully");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};
//# sourceMappingURL=mongo.js.map