import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import cloudinary from "./config/cloudinary.js";
import oldProducts from "./models/oldProducts.js";

await mongoose.connect(process.env.MONGO_URI);

const imgFolder = path.join("public", "img");

async function migrateImages() {

    const products = await oldProducts.find();

    for (const product of products) {

        try {
            // local image path
            const localPath = path.join("C:/Project/E-Commerce/backend/public/img/", product.id + ".png");
            // upload to cloudinary
            const result = await cloudinary.uploader.upload(localPath, {
                folder: "E-Commerce/Products"
            });

            // update DB
            product.Img = result.secure_url;
            await product.save();

            console.log("✅ Uploaded:", product.title);

        } catch (err) {

            console.log("❌ Failed:", product.title, err);
        }
    }

    console.log("🔥 Migration Completed");
    process.exit();
}

migrateImages();
