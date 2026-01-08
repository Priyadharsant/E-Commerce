import React, { useState } from "react";

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
            const res = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

            let data = {};
            try {
                data = await res.json();
            } catch { }

            if (!res.ok) {
                setIncorrect(true);
                setMsg(data.msg || "Invalid credentials");
            } else {
                window.location.href = "/";
            }

        } catch (err) {
            setIncorrect(true);
            setMsg("Something went wrong");
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
