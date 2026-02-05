import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

let database;

export const connectDB = async () => {
    try {
        await client.connect();

        database = client.db("E-Commerce");

        console.log("✅ MongoDB connected");

    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};

export const getDB = () => {
    if (!database) {
        throw new Error("Database not initialized!");
    }
    return database;
};
