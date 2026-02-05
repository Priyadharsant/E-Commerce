import express from "express";
import isAuth from "../../controller/Auth/Auth_controller.js";
import { login, signup } from "../../controller/Auth/Auth_controller.js";
import passport from "passport";
import User from "../../models/User.js";

const route = express.Router()

route.get("/isAuth", isAuth)

route.post("/login", (login));

route.post("/logout", (req, res) => {
    req.logout(() => res.json({ msg: "Logged out Successfully" }));
});

route.post("/signup", (signup));



export default route;