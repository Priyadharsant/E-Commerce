import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    id: String,
    quantity: Number
});

// 👇 force exact collection name
export default mongoose.model("Cart", CartSchema, "Cart");
