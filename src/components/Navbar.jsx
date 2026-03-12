import React from 'react';
import { NavLink, useNavigate} from 'react-router-dom';
import App from '../App';

const Navbar = () => {
  const navigate = useNavigate();

const logout = () => {
  localStorage.clear();
  navigate("/");
};

const handleLogout = () => {
    localStorage.clear(); 
    navigate("/");       
  };

  return (
    <nav className="navbar-custom">
      <h2>TSABOOK-WEB</h2>
      <ul className="navbar-menu">
        <li>
          <NavLink to="/homePage" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/produk" className={({ isActive }) => isActive ? "active" : ""}>Produk</NavLink>
        </li>
        <li>
          <NavLink to="/alamat" className={({ isActive }) => isActive ? "active" : ""}>Alamat</NavLink>
        </li>
        <li>
          <NavLink to="/TestimonialPage" className={({ isActive }) => isActive ? "active" : ""}>Testimonial</NavLink>
        </li>
        <li>
          <NavLink to="/tentangKami" className={({ isActive }) => isActive ? "active" : ""}>Tentang Kami</NavLink>
        </li>
      </ul>

      <button className="btn-logout" onClick={handleLogout}>
        Logout
      </button>

    </nav>
  );
};

export default Navbar;