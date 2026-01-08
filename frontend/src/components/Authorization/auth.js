export async function isLoggedIn() {
    try {
        const res = await fetch("/auth/check", {
            credentials: "include"
        });

        return res.ok;
    } catch {
        return false;
    }
}
