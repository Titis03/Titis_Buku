import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from "react";
import "./App.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Register from "./pages/register";
import Login from "./pages/Login";
import HomePage from "./pages/homePage";
import Produk from "./pages/produk";
import TentangKami from "./pages/tentangKami";
import Alamat from "./pages/alamat";
import TestimonialPage from "./pages/TestimonialPage";
import TransactionDetail from "./pages/TransactionDetail";

function App() {
  const location = useLocation();

  const isAuthenticated = !!localStorage.getItem("accessToken");

  const allowedPaths = ["/homePage", "/produk", "/tentangKami", "/alamat", "/TestimonialPage"];
  const shouldShowHeaderFooter = allowedPaths.includes(location.pathname);

  return (
    <div className="container-app">
      <ScrollToTop />

      {shouldShowHeaderFooter && isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/homePage" /> : <Navigate to="/login" />}
        />

        <Route
          path="/homePage"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/transaksi/:id"
          element={isAuthenticated && localStorage.getItem('role') === 'cashier' ?
            <TransactionDetail /> :
            <Navigate to="/login" />}
        />
        <Route
          path="/produk"
          element={isAuthenticated ? <Produk /> : <Navigate to="/login" />}
        />
        <Route
          path="/tentangKami"
          element={isAuthenticated ? <TentangKami /> : <Navigate to="/login" />}
        />
        <Route
          path="/alamat"
          element={isAuthenticated ? <Alamat /> : <Navigate to="/login" />}
        />
        <Route
          path="/TestimonialPage"
          element={isAuthenticated ? <TestimonialPage /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </div>
  );
}

export default App;