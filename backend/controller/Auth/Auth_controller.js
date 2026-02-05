import passport from "passport";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import session from "express-session";
import { Strategy } from "passport-local";

function isAuth(req, res, next) {
    if (req.isAuthenticated()) res.status(200).json({ msg: "authenticated" });
    return res.status(401).json({ msg: "Not authenticated" });
}
export const login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ msg: info && info.message ? info.message : "Unauthorized" });
        }

        req.logIn(user, err => {
            if (err) return next(err);
            console.log("Logined");
            req.session.user = {
                name:user.username
            }
            res.json({
                msg: "Login success",
                user: { id: user._id, username: user.username }
            });
        });

        
    })(req, res, next);
}
export const signup = async (req, res) => {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
        return res.status(409).json({ msg: "Username exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });

    res.status(201).json({ msg: "User created" });
}

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

export default isAuth 