import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS, apiUrl } from "../../config/api";
import { logError } from "../../utils/errorHandler";
import { useAuth } from "./auth";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIncorrect(false);
        setMsg("");

        try {
            const response = await fetch(apiUrl(ENDPOINTS.LOGIN), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Server returned invalid response (not JSON)");
            }

            if (!response.ok) {
                throw new Error(data.msg || "Invalid credentials");
            }

            // Update auth context with user data
            if (data.user) {
                setUser(data.user);
            }

            // Redirect to home
            navigate("/");
        } catch (err) {
            logError(err, { source: "Login:handleSubmit" });
            setIncorrect(true);
            setMsg(err.message || "Login failed");
        }
    };


    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* <p style={{ textAlign: "center" }}>
                    <a href="/register">Don't have an account? Register here.</a>
                </p> */}

                {incorrect && (
                    <p style={{ color: "red", textAlign: "center" }}>{msg}</p>
                )}

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
