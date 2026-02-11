import jwt from "jsonwebtoken";

// Middleware that acts as the new "strategy" — verifies JWT from cookie or Authorization header
export default function jwtStrategy(req, res, next) {
    try {
        const token = (req.cookies && req.cookies.token) || (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[1]);
        if (!token) return res.status(401).json({ status: "Error", msg: "Unauthorized" });

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not set");
            return res.status(500).json({ status: "Error", msg: "Server misconfiguration" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // attach user info to request
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ status: "Error", msg: "Invalid or expired token" });
    }
}
