function errorHandler(err, req, res, next) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (isDevelopment) {
        console.error("🔥 Error:", err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(isDevelopment && { stack: err.stack })
    });
}

export default errorHandler
