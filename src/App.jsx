import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Components/CartContext";
import Navbar from './Components/Navbar/Navbar.jsx';
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckOut/Checkout";
import OrderHistory from "./components/Orderhistory/OrderHistory";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "./components/Success/Success.jsx";
import Accounts from "./components/Accounts/Accounts.jsx";
import Password from "./components/PasswordChange/Password.jsx";
import PincodePicker from "./Components/Pincode/PincodePicker.jsx";
import ChangeEmail from "./Components/ChangeEmail.jsx";

function App() {
  return (
    <CartProvider>
      <Router>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          {/* <Route path="pin" element={<PincodePicker />} /> */}

        
          <Route path="/Youraccounts" element={<Accounts />} />
        <Route path="/change-password" element={<Password />} />
        <Route path="/change-email" element={<ChangeEmail />} />

          
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
