import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { kelasTerbaru, dataSwiper } from "../data/index";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import React, { useState } from 'react';

function HomePage() {
    const navigate = useNavigate();
    const namaAdmin = localStorage.getItem("username") || "Pengguna";
    const [activeFilter, setActiveFilter] = useState("All Produk");
    const roleUser = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div>
            <div className="navbar">
                <div className="container">
                    <div className="navbar-box">
                        <div className="logo"><h1>TsaBook.id</h1></div>
                        <ul className="menu">
                            <li><a href="#" onClick={logout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="dashboard" style={{ textAlign: "center", paddingTop: "10px", marginTop: "-100px" }}>
                <h1 style={{ color: "SaddleBrown", fontSize: "30px" }}>
                    Selamat Datang, <span id="namaAdmin">{namaAdmin}</span>!
                </h1>
                <h1 style={{ textAlign: "center", fontSize: "16px", paddingTop: "5px", marginTop: "-10px" }}>
                    Sekarang Anda login sebagai <strong>{roleUser}</strong>
                </h1>
            </div>

            <div className="layanan">
                <div className="container">
                    <div className="layanan-box">
                        <div className="box">
                            <i className="ri-book-fill ri-2x"></i>
                            <h2>Produk Original</h2>
                            <p>Koleksi buku kami dijamin 100% asli dari penerbit terpercaya.</p>
                        </div>
                        <div className="box">
                            <i className="ri-wallet-3-fill ri-2x"></i>
                            <h2>Harga Terjangkau</h2>
                            <p>Dapatkan akses literasi tanpa batas dengan harga yang bersahabat.</p>
                        </div>
                        <div className="box">
                            <i className="ri-customer-service-2-fill ri-2x"></i>
                            <h2>Terjual 10k+</h2>
                            <p>Lebih dari sepuluh ribu pembaca telah mempercayakan literaturnya.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="layanan">
                <div className="container">
                    <div className="layanan-box">
                    </div>
                </div>
            </div>

        </div>
    );
}

export default HomePage;