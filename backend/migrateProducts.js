import "dotenv/config";
import mongoose from "mongoose";

import  NewProduct from "./models/newproduct.js";   // old schema
import OldProduct from "./models/Products.js";      // new schema

await mongoose.connect(process.env.MONGO_URI);

async function migrate() {

    const oldProducts = await OldProduct.find();

    console.log("Total products:", oldProducts.length);

    for (const p of oldProducts) {

        try {

            await NewProduct.create({

                title: p.title,
                category: p.category,
                image: p.Img,          // rename field
                description: p.description,
                price: p.price,
                rating: p.rating ?? 0,
                off: p.off

            });

            console.log("✅ Migrated:", p.title);

        } catch (err) {

            console.log("❌ Failed:", p.title);
        }
    }

    console.log("🔥 Migration Completed");
    process.exit();
}

migrate();
