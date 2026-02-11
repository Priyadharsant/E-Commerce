import "dotenv/config";
import mongoose from "mongoose";

import Products from "./models/Products.js";   // old schema
import oldProducts from "./models/oldProducts.js";

await mongoose.connect(process.env.MONGO_URI);

async function migrate() {

    const oldProduct = await oldProducts.find();

    console.log("Total products:", oldProduct.length);

    for (const p of oldProduct) {

        try {

            const data = await Products.create({

                title: p.title,
                category: p.category,
                image: p.Img,          // rename field
                description: p.description,
                price: p.price,
                rating: p.rating ?? 0,
                off: p.off

            });
            console.log(data);

            console.log("✅ Migrated:", p.title);

        } catch (err) {

            console.log("❌ Failed:", p.title);
        }
    }

    console.log("🔥 Migration Completed");
    process.exit();
}

migrate();
