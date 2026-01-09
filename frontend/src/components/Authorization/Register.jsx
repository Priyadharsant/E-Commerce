import React, { useState } from "react";
import { ENDPOINTS } from "../../config/api";
import { fetchJson } from "../../utils/api";
import { logError, userMessageFromError } from "../../utils/errorHandler";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [duplicateUser, setDuplicateUser] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setDuplicateUser(false);

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        try {
            await fetchJson(ENDPOINTS.SIGNUP, { method: "POST", body: JSON.stringify({ username, password }) });
            window.location.href = "/login";
        } catch (err) {
            logError(err, { source: "Register:handleSubmit" });
            setDuplicateUser(true);
            setErrorMsg(userMessageFromError(err) || "Something went wrong");
        }
    };


    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>

                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>



                <p style={{ textAlign: "center" }} >
                    <a href="/login">Already have an account? Login here.</a>
                </p>

                {(duplicateUser || errorMsg) && (
                    <p id="error-message" style={{ color: "red", textAlign: "center" }}>
                        {errorMsg}
                    </p>
                )}

                <button type="submit" id="registerBtn">
                    Register
                </button>
            </form>
        </div >
    );
}

export default Register;
