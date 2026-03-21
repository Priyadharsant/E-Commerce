import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "./config/Passport.js"
import User from "./models/User.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "https://priyadharsant.github.io/E-Commerce";
const configuredOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
const allowedOrigins = [...new Set([
    FRONTEND_URL,
    "http://localhost:3000",
    "https://ecommerce.priyan.online",
    ...configuredOrigins
])];
const allowedHostSuffixes = [
    ".netlify.app",
    ".github.io",
    ".onrender.com",
    ".priyan.online"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        try {
            const url = new URL(origin);
            const host = url.hostname;
            if (allowedHostSuffixes.some(suffix => host.endsWith(suffix))) {
                return callback(null, true);
            }
        } catch (e) {
        }

        console.warn(`CORS blocked origin: ${origin}`);
        return callback(new Error("CORS policy: This origin is not allowed."));
    },
    credentials: true
}));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: tru
// e
// }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// parse cookies so jwt/auth middleware can read token from cookie
app.use(cookieParser());

const isProd = process.env.NODE_ENV === "production";
if (isProd) app.set("trust proxy", 1);
// 1. Session Config
app.use(session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// 2. Initialize Passport
app.use(passport.initialize());

// 3. Persistent Login Sessions
app.use(passport.session());
app.disable("x-powered-by");

function ConnectDb() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB connected"))
        .catch(err => {
            console.error(err)
            setTimeout(ConnectDb, 500);
        });
}
ConnectDb();


app.use("/api", routes);
// Also mount routes at root to support clients calling endpoints without the /api prefix
app.use("/", routes);

app.get("/checksstatus", (req, res) => {
    return res.status(200).json({ msg: "Running Successfully..." });
})

// app.use((req, res) => {
//     res.status(404).json({ msg: "Api Not found" });
// });

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
    throw err;
});
