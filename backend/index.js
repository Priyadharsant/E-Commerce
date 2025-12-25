import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Products from "./modols/Products.js";
import Cart from "./modols/Cart.js";
import cors from "cors";

const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/E-Commerce")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

let i = 0;
app.get("/get", async (req, res) => {
    const product = await Products.find();
    res.json(product);
});

app.post("/add_cart", async (req, res) => {
    try {
        const { id } = req.body;
        let quantity = await Cart.findOne({ id: id }, { quantity: 1 })

        if (!quantity) {
            await Cart.create({ id: id, quantity: 1 });
        }
        else {
            await Cart.updateOne({ id: id }, { $inc: { quantity: 1 } })
        }
        res.json({ message: "Added to cart" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); app.post("/delete_cart", async (req, res) => {
    try {
        const { id } = req.body;

        const cartItem = await Cart.findOne({ id });
        if (!cartItem) {
            return res.json({ message: "Item not in cart" });
        }
        if (cartItem.quantity <= 1) {
            await Cart.deleteOne({ id });
        }
        else {
            await Cart.updateOne(
                { id },
                { $inc: { quantity: -1 } }
            );
        }

        res.json({ message: "Cart updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.get("/get_cart", async (req, res) => {
    try {
        const cartItems = await Cart.find();

        const productIds = cartItems.map(item => item.id);

        const products = await Products.find({
            id: { $in: productIds }
        });
        const result = products.map(product => {
            const cartItem = cartItems.find(
                item => item.id === product.id
            );

            return {
                ...product._doc,
                quantity: cartItem.quantity
            };
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(5000, () => {
    console.log("http://localhost:5000/get");
});
