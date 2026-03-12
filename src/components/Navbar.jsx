import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate} from 'react-router-dom';
import { BsCart3 } from 'react-icons/bs';
import axios from 'axios';
import CartDropDown from './CartDropDown';  

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (token && userId) {
      fetchCartCount();
    }
    
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/cart/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const total = response.data.items?.reduce(
        (sum, item) => sum + item.quantity, 0
      ) || 0;
      
      setCartCount(total);
      
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/");       
  };

  return (
    <>
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

        <button 
          onClick={() => setCartOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            fontSize: '24px',
            marginRight: '15px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <BsCart3 color="#007806" />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>
              {cartCount}
            </span>
          )}
        </button>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <CartDropDown isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;