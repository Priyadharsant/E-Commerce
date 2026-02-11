import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    data: {
        id: String,
        category: String,
        image: String,
        title: String,
        description: String,
        rating: Number,
        price: Number,
        off: Number
    },
    status: String
});

export default mongoose.model("temp", productSchema, "temp");
