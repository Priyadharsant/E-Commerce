import { fetchJson } from "../../utils/api";
import { userMessageFromError, logError } from "../../utils/errorHandler";

export async function isLoggedIn() {
    try {
        const data = await fetchJson("/isAuth");
        return data && data.authenticated === true;
    } catch (err) {
        logError(err, { source: "isLoggedIn" });
        return false;
    }
}
