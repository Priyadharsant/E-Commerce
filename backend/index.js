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
import asyncHandler from "./utils/asyncHandler.js";
import { logError } from "./utils/errorLogger.js";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "https://priyadharsant.github.io/E-Commerce";
const allowedOrigins = [FRONTEND_URL, "http://localhost:3000"];

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin: true,/*function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        // allow explicit allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // allow Netlify preview or site domains and GitHub Pages domains
        try {
            const url = new URL(origin);
            const host = url.hostname;
            if (host.startsWith("http:localhost") || host.endsWith(".netlify.app") || host.endsWith(".github.io")) {
                return callback(null, true);
            }
        } catch (e) {
            // ignore malformed origin
        }

        console.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error("CORS policy: This origin is not allowed."));
    }*/
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const isProd = process.env.NODE_ENV === "production";
// trust proxy when behind a proxy (e.g., render, heroku)
if (isProd) app.set("trust proxy", 1);

app.use(session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd, // cookies only sent over HTTPS in production
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


app.get("/get", asyncHandler(async (req, res) => {
    const products = await Products.find();
    res.json(products);
}));

app.get("/categories", asyncHandler(async (req, res) => {
    const categories = await Products.distinct("category");
    res.json(categories);
}));

app.get("/filter", asyncHandler(async (req, res) => {
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
}));

app.post("/add_cart", isAuth, asyncHandler(async (req, res) => {
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
}));


app.post("/delete_cart", isAuth, asyncHandler(async (req, res) => {
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
}));

app.get("/get_cart", isAuth, asyncHandler(async (req, res) => {
    const cartItems = await Cart.find({ userId: req.user._id });

    const ids = cartItems.map(i => i.productId);
    const products = await Products.find({ id: { $in: ids } });

    const result = products.map(p => {
        const cart = cartItems.find(c => c.productId === p.id);
        return { ...p._doc, quantity: cart.quantity };
    });

    res.json(result);
}));


app.post("/signup", asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
        return res.status(409).json({ msg: "Username exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });

    res.status(201).json({ msg: "User created" });
}));

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ msg: info && info.message ? info.message : "Unauthorized" });
        }

        req.logIn(user, err => {
            if (err) return next(err);
            console.log("Logined");
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

// 404 handler
app.use((req, res) => {
    res.status(404).json({ msg: "Not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
    // log error in development
    try { logError(err, req); } catch (e) { /* ignore logging errors */ }

    const status = err && err.status ? err.status : 500;
    const safeMessage = status >= 500 ? "Internal server error" : (err && err.message ? err.message : "Error");
    res.status(status).json({ msg: safeMessage });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
