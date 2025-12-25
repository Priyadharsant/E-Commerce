import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: String,
    category: String,
    Img: String,
    title: String,
    description: String,
    rating: Number,
    price: Number,
    off: Number
});

// 👇 force exact collection name
export default mongoose.model("Products", productSchema, "Products");
