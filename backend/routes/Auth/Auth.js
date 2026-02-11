import express from "express";
import { isAuth, logout, login, signup } from "../../controller/Auth/Auth_controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const route = express.Router();

// Protected endpoint - requires JWT auth
route.get("/isAuth", authMiddleware, isAuth);

// Login and signup
route.post("/login", login);
route.post("/signup", signup);

// Logout clears the token
route.post("/logout", logout);

export default route;
