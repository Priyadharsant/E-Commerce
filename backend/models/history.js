import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    data: Object
});

export default mongoose.model("history", productSchema, "history");
