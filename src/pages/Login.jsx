import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; 

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

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("username", response.data.user.username);
            localStorage.setItem("role", response.data.user.role);
            
            alert("Login berhasil! Selamat datang, " + response.data.user.username);
            
            window.location.href = "/homePage"; 
            
        } catch (error) {
            console.error(error);
            const pesanError = error.response?.data?.error || "Login gagal. Periksa koneksi ke server.";
            alert(pesanError);
        }
    };

    return (
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

                    <p className="note" style={{ marginTop: "15px" }}>
                        Belum punya akun? <Link to="/register" className="back-link">Daftar di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;