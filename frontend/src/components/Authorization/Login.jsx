import React, { useState } from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIncorrect(false);
        setMsg("");

        try {
            await fetchJson(ENDPOINTS.LOGIN, { method: "POST", body: JSON.stringify({ username, password }) });
            window.location.href = "/";
        } catch (err) {
            logError(err, { source: "Login:handleSubmit" });
            setIncorrect(true);
            setMsg(userMessageFromError(err) || "Invalid credentials");
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

                <p style={{ textAlign: "center" }}>
                    <a href="/register">Don't have an account? Register here.</a>
                </p>

                {incorrect && (
                    <p style={{ color: "red", textAlign: "center" }}>{msg}</p>
                )}

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
