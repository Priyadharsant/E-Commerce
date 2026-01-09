export function logError(err, req = {}) {
    // In development, print full error and request info
    if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("[Server Error]", err && err.stack ? err.stack : err);
        if (req && req.method) {
            // eslint-disable-next-line no-console
            console.error("Request:", req.method, req.originalUrl);
        }
    }
    // Here: integrate with external logging service if desired
}
