// Middleware to check if user is admin
// Requires authMiddleware to be used first
const adminMiddleware = (req, res, next) => {
    // Check if user is authenticated (from authMiddleware)
    if (!req.user) {
        return res.status(401).json({
            status: "Error",
            msg: "Unauthorized - Please login"
        });
    }

    // Check if user has admin role
    // Note: Update your User model to include a role field
    // For now, we'll use a simple check - you can enhance this
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: "Error",
            msg: "Forbidden - Only admins can perform this action"
        });
    }

    next();
};

export default adminMiddleware;
