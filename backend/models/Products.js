import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        unique: true,
        index: true
    },

    category: {
        type: String,
        required: true
    },

    image: String, // cleaner than Img

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

productSchema.pre("save", function (next) {

    if (!this.isModified("title")) return next();

    const baseSlug = slugify(this.title, {
        lower: true,
        strict: true
    });

    // take last 4 characters from Mongo _id
    const uniquePart = this._id.toString().slice(-4);

    this.slug = `${baseSlug}-${uniquePart}`;

    next();
});



export default mongoose.model("Products", productSchema, "Products");
