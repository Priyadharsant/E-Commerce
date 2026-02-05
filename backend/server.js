import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "./config/Passport.js"
import User from "./models/User.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "https://priyadharsant.github.io/E-Commerce";
const allowedOrigins = [FRONTEND_URL, "http://localhost:3000"];

app.use(cors({
    origin: "http://localhost:3000", // your frontend EXACT URL
    credentials: true
}));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }));

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             return callback(null, true);
//         }

//         try {
//             const url = new URL(origin);
//             const host = url.hostname;
//             if (host.endsWith(".netlify.app") || host.endsWith(".github.io")) {
//                 return callback(null, true);
//             }
//         } catch (e) {
//         }

//         console.warn(`CORS blocked origin: ${origin}`);
//         return callback(new Error("CORS policy: This origin is not allowed."));
//     },
//     credentials: true
// }));

const allowedOrigin = [
    "http://localhost:3000",
    "http://10.174.249.55:3000"
];

// app.use(cors({
//     origin: function (origin, callback) {

//         // allow Postman / mobile apps
//         if (!origin) return callback(null, true);

//         if (allowedOrigin.includes(origin)) {
//             return callback(null, true);
//         }

//         console.log("Blocked by CORS:", origin);
//         return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true
// }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
        secure: false, // Must be false for localhost (HTTP)
        sameSite: "lax",
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
            setTimeout(ConnectDb(), 500);
        });
}
ConnectDb();


app.use("", routes);

app.get("/checksstatus", (req, res) => {
    res.sendStatus(200).json({ msg: "Running Successfully..." });
})

// app.use((req, res) => {
//     res.status(404).json({ msg: "Api Not found" });
// });

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));