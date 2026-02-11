import { createContext, useContext, useEffect, useState } from "react";
import { fetchJson } from "../../utils/api";
import { ENDPOINTS } from "../../config/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {

                const data = await fetchJson(ENDPOINTS.IS_AUTH);

                setUser(data?.user || null);

            } catch (err) {

                setUser(null);

            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
