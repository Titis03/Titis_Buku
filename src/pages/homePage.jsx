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
    const roleUser = localStorage.getItem("role") || "Guest";
    const [activeFilter, setActiveFilter] = useState("All Produk");

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const bukuDifilter = activeFilter === "All Produk"
        ? kelasTerbaru
        : kelasTerbaru.filter(buku => buku.kategori === activeFilter);

    return (
        <div>
            <div className="navbar">
                <div className="container">
                    <div className="navbar-box">
                        <div className="logo"><h1>TsaBook.id</h1></div>
                        <ul className="menu">
                            <li><a href="#produk">Produk</a></li>
                            <li><a href="#testimoni">Testimoni</a></li>
                            <li>
                                <a href="#" onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate("/tentangKami"); 
                                }}>
                                    Tentang Kami
                                </a>
                            </li>                            
                            <li>
                                <a href="#" onClick={(e) => {
                                    e.preventDefault(); 
                                    navigate("/alamat"); 
                                }}>
                                    Alamat Kami
                                </a>
                            </li>  
                            <li><a href="#" onClick={logout} style={{ color: 'red' }}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="dashboard" style={{ textAlign: "center", padding: "5px 0" }}>
                <h1 style={{ color: "SaddleBrown", fontSize: "40px" }}>
                    Selamat Datang, <span id="namaAdmin">{namaAdmin}</span>!
                </h1>
                <p>Sekarang Anda login sebagai <strong>{roleUser}</strong></p>
            </div>

            <div className="layanan">
                <div className="container">
                    <div className="layanan-box">
                        <div className="box">
                            <i className="ri-book-fill"></i>
                            <h2>Produk Original</h2>
                            <p>Koleksi buku kami dijamin 100% asli dari penerbit terpercaya.</p>
                        </div>
                        <div className="box">
                            <i className="ri-wallet-3-fill"></i>
                            <h2>Harga Terjangkau</h2>
                            <p>Dapatkan akses literasi tanpa batas dengan harga yang bersahabat.</p>
                        </div>
                        <div className="box">
                            <i className="ri-customer-service-2-fill"></i>
                            <h2>Terjual 10k+</h2>
                            <p>Lebih dari sepuluh ribu pembaca telah mempercayakan literaturnya.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="produk" id="produk">
                <div className="container">
                    <div className="produk-box">
                        <h1 className="text-center">Koleksi Buku Kami</h1>

                        <ul className="filter-tab">
                            {["All Produk", "Fiksi Indonesia", "Pengembangan Diri", "Fiksi Terjemahan"].map((item) => (
                                <li
                                    key={item}
                                    className={activeFilter === item ? "active" : ""}
                                    onClick={() => setActiveFilter(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="produk-list">
                            {bukuDifilter.map((buku) => (
                                <div className="card-produk" key={buku.id}>
                                    <img src={buku.src} alt={buku.nama} />
                                    <div className="info-buku">
                                        <h3>{buku.nama}</h3>
                                        <p className="kategori-tag">{buku.kategori}</p>
                                        <p className="harga-text">{buku.harga}</p>
                                        <p className="deskripsi-singkat">{buku.deskripsi}</p>
                                        <button className="btn-beli">Beli Sekarang</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="testimoni" id="testimoni" style={{ padding: "80px 0", backgroundColor: "#fff" }}>
                <Container>
                    <h1 className="text-center mb-5">Apa Kata Mereka?</h1>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {dataSwiper.map((data) => (
                            <SwiperSlide key={data.id}>
                                <div className="testi-card">
                                    <p className="desc">{data.desc}</p>
                                    <div className="user">
                                        <img src={data.image} alt="" />
                                        <div>
                                            <h5>{data.name}</h5>
                                            <p>{data.skill}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Container>
            </div>
        </div>
    );

}

export default HomePage;