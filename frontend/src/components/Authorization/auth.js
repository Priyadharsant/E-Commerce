export async function isLoggedIn() {
    try {
        const res = await fetch("http://localhost:5000/auth/check", {
            credentials: "include"
        });

        return res.ok;
    } catch {
        return false;
    }
}
