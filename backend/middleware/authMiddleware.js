import jwtStrategy from "../config/jwtStrategy.js";

// Delegate to the new jwtStrategy middleware
export default function authMiddleware(req, res, next) {
    return jwtStrategy(req, res, next);
}
