import { apiUrl } from "../config/api";
import { logError } from "./errorHandler";

async function parseJsonSafe(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

export async function fetchJson(pathOrFullUrl, options = {}) {
    const url = pathOrFullUrl.startsWith("http") ? pathOrFullUrl : apiUrl(pathOrFullUrl);
    const opts = { credentials: "include", headers: { "Content-Type": "application/json" }, ...options };

    try {
        const res = await fetch(url, opts);
        const data = await parseJsonSafe(res);
        if (!res.ok) {
            const err = new Error((data && (data.msg || data.message)) || `Request failed with status ${res.status}`);
            err.status = res.status;
            err.data = data;
            throw err;
        }
        return data;
    } catch (error) {
        logError(error, { url, options: opts });
        throw error;
    }
}
