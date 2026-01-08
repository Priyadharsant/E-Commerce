import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import dotenv from "dotenv";
import Products from "./models/Products.js";
import Cart from "./models/Cart.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",   // ✅ DEFAULT & SAFE
        secure: false,     // localhost
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.use(passport.initialize());
app.use(passport.session());

app.disable("x-powered-by");

function ConnectDb() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB connected"))
        .catch(err => {
            console.error(err)
            setTimeout(ConnectDb(), 5000);
        });
}
ConnectDb();


function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ msg: "Not authenticated" });
}

app.get("/isAuth", (req, res) => {
    res.json({
        authenticated: req.isAuthenticated(),
        user: req.user || null
    });
});
app.post("/logout", (req, res) => {
    res.clearCookie("connect.sid"); // or your cookie name
    res.sendStatus(200);
});


passport.use(new Strategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Wrong password" });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});


app.get("/get", async (req, res) => {
    const products = await Products.find();
    res.json(products);
});

app.get("/categories", async (req, res) => {
    const categories = await Products.distinct("category");
    res.json(categories);
});

app.get("/filter", async (req, res) => {
    const { category } = req.query;

    if (!category || category === "all") {
        const products = await Products.find();
        const grouped = {};

        products.forEach(p => {
            if (!grouped[p.category]) grouped[p.category] = [];
            grouped[p.category].push(p);
        });

        return res.json({ type: "all", data: grouped });
    }

    const products = await Products.find({ category });
    res.json({ type: "single", data: { [category]: products } });
});

app.post("/add_cart", isAuth, async (req, res) => {
    const { id } = req.body;
    const userId = req.user._id;

    const item = await Cart.findOne({ userId, productId: id });

    if (!item) {
        await Cart.create({ userId, productId: id, quantity: 1 });
    } else {
        await Cart.updateOne(
            { userId, productId: id },
            { $inc: { quantity: 1 } }
        );
    }

    res.json({ msg: "Added to cart" });
});


app.post("/delete_cart", isAuth, async (req, res) => {
    const { id } = req.body;
    const userId = req.user._id;

    const item = await Cart.findOne({ userId, productId: id });
    if (!item) return res.json({ msg: "Item not found" });

    if (item.quantity <= 1) {
        await Cart.deleteOne({ userId, productId: id });
    } else {
        await Cart.updateOne(
            { userId, productId: id },
            { $inc: { quantity: -1 } }
        );
    }

    res.json({ msg: "Cart updated" });
});

app.get("/get_cart", isAuth, async (req, res) => {
    const cartItems = await Cart.find({ userId: req.user._id });

    const ids = cartItems.map(i => i.productId);
    const products = await Products.find({ id: { $in: ids } });

    const result = products.map(p => {
        const cart = cartItems.find(c => c.productId === p.id);
        return { ...p._doc, quantity: cart.quantity };
    });

    res.json(result);
});


app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
        return res.status(409).json({ msg: "Username exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });

    res.status(201).json({ msg: "User created" });
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (!user) {
            return res.status(401).json({ msg: info.message });
        }

        req.logIn(user, err => {
            if (err) return next(err);
            console.log("Logined")
            res.json({
                msg: "Login success",
                user: { id: user._id, username: user.username }
            });
        });
    })(req, res, next);
});

app.post("/logout", (req, res) => {
    req.logout(() => res.json({ msg: "Logged out" }));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
