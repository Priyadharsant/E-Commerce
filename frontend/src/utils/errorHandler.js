export function logError(error, context = {}) {
    // Only log stack/details in development
    if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("[Error]", error, context);
    }
    // Here you could forward errors to a remote logging service when desired
}

export function userMessageFromError(error) {
    if (!error) return "Something went wrong";
    // If API returned an object with message
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (error.msg) return error.msg;
    return "Something went wrong";
}
