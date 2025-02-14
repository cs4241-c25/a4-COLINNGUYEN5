import {useNavigate} from "react-router-dom";
import { useState } from "react";
function Login() {

    const navigate = useNavigate(); // Hook to navigate programmatically
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const API_BASE_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:3001"
            : "https://a4-colinnguyen5.glitch.me";

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
                if (!username || !password) {
                    alert("Please enter both username and password");
                    return;
                }
                try {
                    const response = await fetch(`${API_BASE_URL}/api/login/password`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                        credentials: "include",
                        mode: "cors"
                    });
                    const data = await response.json();
                    if (response.ok) {
                        if (data.message === "new_account_created") {
                            alert("New Account Created!");
                        } else {
                            alert(`${data.message}`);
                        }
                        navigate("/tracking-sheet");
                    } else {
                        alert(`${data.error || "Login failed"}`);
                    }
                } catch (error) {
                    alert("An error occurred. Please try again.");
                }
    };

    return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form id="loginForm" className="flex-start bg-white border-2 p-4 rounded-lg space-y-4 shadow-xl" onSubmit={handleLogin}>
                    <h1 className="font-bold text-4xl pb-2 underline">Sign in</h1>
                    <section>
                        <label htmlFor="username">Username</label>
                        <input id="username"
                               name="username"
                               type="text"
                               value={username}
                               autoComplete="username"
                               className="border-2 pl-2 ml-1"
                               onChange={(e) => setUsername(e.target.value)}
                               required/>
                    </section>
                    <section>
                        <label htmlFor="current-password">Password</label>
                        <input id="current-password"
                               name="password"
                               type="password"
                               value={password}
                               autoComplete="current-password"
                               className="border-2 pl-2 ml-2"
                               onChange={(e) => setPassword(e.target.value)}
                               required/>
                    </section>
                    <button type="submit" className="bg-gray-100 border-2 rounded-lg p-2 mr-6 hover:bg-sky-300">
                        Sign in
                    </button>
                    <a href="/api/auth/github" className="bg-gray-100 border-2 rounded-lg p-1 hover:bg-sky-300">
                        Login with GitHub
                    </a>
                </form>
            </div>
    );
}

export default Login;