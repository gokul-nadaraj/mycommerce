import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import Razorpay from "razorpay"; // Ensure Razorpay is properly imported or included via script
import { db } from "../Firebase/firebase"; // Adjust this path as per your project structure
import './Payment.css'


const Payment = ({}) => {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [isRadioChecked, setIsRadioChecked] = useState(false);
  const navigate = useNavigate();

  const handleRadioChange = () => {
    setIsRadioChecked(!isRadioChecked);
  };

  const paymentHandler = async () => {
    if (!user) {
      toast.error("Please log in to complete the checkout.", { autoClose: 6000 });
      navigate("/login", { state: { fromCheckout: true } });
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username: user.displayName,
          email: user.email,
          orders: [],
        });
      }

      const orderbody = {
        amount: 100, // Replace with actual amount
        currency: "INR",
        receipt: "receiptId_1",
      };
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": "nb7yqBXPNZ8RDEsa0s7sS8OxEn9bujNV1c1VK3vc",
      };

      const response = await axios.post(
        "https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/order",
        orderbody,
        { headers }
      );

      const order = response.data;

      const options = {
        key: "", // Add your Razorpay key here
        amount: orderbody.amount,
        currency: orderbody.currency,
        name: "TinyKarts (YesurajSeelan)",
        order_id: order.id,
        handler: async (response) => {
          const body = JSON.stringify(response);
          const validateRes = await axios.post(
            "https://178sjvr7ai.execute-api.ap-south-1.amazonaws.com/order/validate",
            body,
            { headers }
          );

          const jsonRes = validateRes.data;

          toast.success("Payment successful!", { autoClose: 6000 });
          navigate("/success", { state: { order: { cart } } });
        },
        prefill: {
          name: user.displayName,
          email: user.email,
          contact: user.phoneNumber || "1234567890",
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();

      setCart({ items: [], total: 0 }); // Clear the cart after successful payment
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment initiation failed!", { autoClose: 6000 });
    }
  };

  return (
    <>
      <h1 onClick={() => setShowPaymentMethods(!showPaymentMethods)} className="header">
        3. Payment Methods
      </h1>
      {showPaymentMethods && (
        <div className="payment-container">
          <div className="input-name">
            <input
              className="radio"
              type="radio"
              id="razorpay"
              name="payment"
              checked={isRadioChecked}
              onChange={handleRadioChange}
            />
            <label htmlFor="razorpay" className="razorpay">
              Razorpay
            </label>
          </div>
          <div className="pay-btn">
            <button
              onClick={paymentHandler}
              className={`pay-button ${isRadioChecked ? "enabled" : ""}`}
              disabled={!isRadioChecked}
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
