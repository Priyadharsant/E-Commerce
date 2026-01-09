import { apiUrl, ENDPOINTS } from "../../config/api";

export async function isLoggedIn() {
    try {
        const res = await fetch(apiUrl(ENDPOINTS.IS_AUTH), {
            credentials: "include"
        });

        return res.ok;
    } catch {
        return false;
    }
}
