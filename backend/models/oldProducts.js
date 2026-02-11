import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    id: String,

    category: {
        type: String,
        required: true
    },

    Img: String,

    description: String,

    price: {
        type: Number,
        required: true
    },

    rating: {
        type: Number,
        default: 0
    },

    off: Number

}, {
    timestamps: true
});


export default mongoose.model("oldProducts", productSchema, "oldProducts");
