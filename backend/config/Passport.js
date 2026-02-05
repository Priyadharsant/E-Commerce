import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.js";

// LOCAL STRATEGY
passport.use(new Strategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });

        if (!user)
            return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return done(null, false, { message: "Wrong password" });

        return done(null, user);

    } catch (err) {
        return done(err);
    }
}));


// STORE USER ID IN SESSION
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log("Session ID found, looking for user:", id);
        const user = await User.findById(id);
        if (!user) console.log("No user found in DB for this ID");
        done(null, user);
    } catch (err) {
        console.error("Deserialization error:", err);
        done(err);
    }
});

export default passport;
