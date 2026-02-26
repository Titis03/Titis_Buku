import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import HomePage from "./pages/homePage";
import TentangKami from "./pages/tentangKami";
import Alamat from "./pages/alamat";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="container-app">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/homePage" element={< HomePage />} />
        <Route path="/tentangKami" element={< TentangKami />} />
        <Route path="/alamat" element={< Alamat />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;