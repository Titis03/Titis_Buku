import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const Register = () => {
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                fullname,
                username,
                email,
                password
            });
            
            alert(response.data.message);
            navigate("/login"); 
        } catch (error) {
            alert(error.response?.data?.message || "Registrasi Gagal");
        }
    };

    return (
        <div className="login-body">
            <div className="login-overlay">
                <div className="login-box">
                    <h2>Daftar Akun</h2>
                    <form onSubmit={handleRegister}>
                        <input type="text" placeholder="Nama Lengkap" onChange={(e) => setFullname(e.target.value)} required />
                        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Daftar Sekarang</button>
                    </form>
                    <p className="note">Sudah punya akun? <a href="/login" className="back-link">Login di sini</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;