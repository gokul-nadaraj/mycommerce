import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from "../CartContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { auth } from "../Firebase/firebase";
import { signOut } from "firebase/auth";
import { SlBag } from "react-icons/sl";
import { PiUserCircleThin } from "react-icons/pi";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faShoppingCart, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'

const Navbar = () => {

  const [user] = useAuthState(auth);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { cartIconQuantity } = useCart();
  const handleLogout = async () => {
    signOut(auth).then(() => {
      navigate('/');
      localStorage.removeItem('cart'); // Clear cart in localStorage (if used)
      // Sign-out successful.
      alert('Signed out successfully');
      setShowLogout(false); 
      
    }).catch((error) => {
      alert('Error during sign-out:', error);
    });

  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };


  return (
    <div>
    <nav className="navbar">
      <div>
  <Link to="/" className="navbar-logo">
    <img src="/images/logo.png" alt="logo" />
  </Link>
</div>

<div className="list-container">
  <ul>
        <li>Home</li>
        <li>Products</li>
        <li>Contact</li>
        </ul>
      </div>
 

  {user ? (
    <>
      <Link to="/cart" className="navbar-link">

        <SlBag className='icon' />
        <p className='quan'>{cartIconQuantity}</p>
      </Link>

      <div className="navbar-user" onClick={() => setShowLogout(!showLogout)}>
        <span className="user-name">
          <p>{(user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()) || "U"}</p>
        </span>

        {showLogout && (
          <div >
            <button className="navbar-btn" onClick={() => navigate("/order-history")}>
              Your Orders
            </button>
            <button className="navbar-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  ) : (
    <>
      <Link to="/cart" className="navbar-link">
  
        <SlBag className='icon' />
        <p className='quan'>{cartIconQuantity}</p>
      </Link>

      <Link to="/login" className="navbar-link1">
      <PiUserCircleThin  className='img '/>
      </Link>
    </>
  )}
</nav>


  </div>
  
  );
};

export default Navbar;

  {/* <Link to="/signup" className="navbar-link">
        Signup
      </Link> */}