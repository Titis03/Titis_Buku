import { useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                username,
                password
            });
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("isLogin", "true");
            alert("Login berhasil");
            navigate("/homePage");
        } catch (error) {
            alert("Login gagal. Pastikan API Server sudah menyala.");
        }
    };

    return (
        <div className="dashboard-page"> 
            <Navbar />
<div className="login-body">
            <div className="login-overlay">
                <div className="login-box">
                    <h2>Login TsaBook.id</h2>

                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="Username"
                            required
                        />
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Masuk</button>
                    </form>

                </div>
            </div>
        </div>
        </div>
    );
}

export default Login;