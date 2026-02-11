import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Simple isAuth handler — expects authentication middleware to populate req.user
export const isAuth = async (req, res) => {
    if (req.user) {
        return res.status(200).json({ msg: "authenticated", user: { id: req.user.id || req.user._id, username: req.user.username, role: req.user.role } });
    }

    return res.status(401).json({ msg: "Not authenticated" });
};

// Logout: clear JWT cookie and destroy session if present
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    if (req.session) {
        req.session.destroy(() => {
            return res.status(200).json({ msg: "Logged out successfully" });
        });
    } else {
        return res.status(200).json({ msg: "Logged out successfully" });
    }
};

// Login using username + password, returns JWT in httpOnly cookie
export const login = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ msg: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ msg: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ msg: "Invalid credentials" });

        if (!process.env.JWT_SECRET) {
            console.error("ERROR: JWT_SECRET is not defined in environment variables");
            return res.status(500).json({ msg: "Server configuration error" });
        }

        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({ msg: "Login success", user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// Signup - create user with hashed password
export const signup = async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ msg: "Username and password are required" });
        }

        const exists = await User.findOne({ username });
        if (exists) return res.status(409).json({ msg: "Username exists" });

        const hash = await bcrypt.hash(password, 10);
        const created = await User.create({ username, password: hash });

        return res.status(201).json({ msg: "User created", user: { id: created._id, username: created.username } });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
