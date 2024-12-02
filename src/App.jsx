import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import Navbar from './components/Navbar/Navbar.jsx';
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Cart from "./components/Cart/cart.jsx";
// import Signup from "./components/Signup/Signup"
import Checkout from "./components/CheckOut/Checkout";
import OrderHistory from "./components/Orderhistory/OrderHistory";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "./components/Success/Success.jsx";

function App() {
  return (
    <CartProvider>
    <Router>
    <ToastContainer />
    <Navbar/>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;