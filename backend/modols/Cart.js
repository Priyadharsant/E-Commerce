import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    id: String,
    quantity: Number
});

export default mongoose.model("Cart", CartSchema, "Cart");
