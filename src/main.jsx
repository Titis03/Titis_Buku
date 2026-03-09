import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 1. Import CSS Framework (Paling Atas)
import 'bootstrap/dist/css/bootstrap.min.css';

// 2. Import CSS Global/Custom (Setelah Bootstrap agar bisa menimpa gaya default)
import './index.css';

// 3. Import Komponen Utama
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter membungkus App agar fitur Navigasi aktif di seluruh aplikasi */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);