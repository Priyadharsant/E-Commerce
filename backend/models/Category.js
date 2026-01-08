import mongoose from "mongoose";

const category = new mongoose.Schema({
    categories: Array
})

export default mongoose.model("Categories", category, "Categories");