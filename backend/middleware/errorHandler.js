function errorHandler(err, req, res, next) {
    console.error("🔥 Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';

    res.status(statusCode).json({
        success: false,
        message: message // Only include stack in development
    });
}

module.exports = errorHandler;
