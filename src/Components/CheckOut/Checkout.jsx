import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import axios from "axios";
import "./Checkout.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate("/login", { state: { fromCheckout: true } });
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
        amount: 100,
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
        key: "",
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
  
          // Clear cart and navigate to Success page
          toast.success("Payment successful!", { autoClose: 6000 });
          console.log("Navigating with order:", { cart });
          navigate("/success", { state: { order: { cart } } });
        },
        prefill: {
          name: user.displayName,
          email: user.email,
          contact: user.phoneNumber || "1234567890",
        },
        theme: { color: "#3399cc" },
      };
      setCart({ items: [], total: 0 });
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment initiation failed!", { autoClose: 6000 });
    }
  };


const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    country: "",
    mobileNo: "",
    pincode: "",
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentEditAddress, setCurrentEditAddress] = useState(null);
  

  const [showAddress, setShowAddress] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);


  const [isRadioChecked, setIsRadioChecked] = useState(false);

  const handleRadioChange = () => {
    setIsRadioChecked(!isRadioChecked);
  };


  // Fetch saved addresses for the logged-in user
  useEffect(() => {
    const fetchAddresses = async () => {
      const user = auth.currentUser;
  
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          setSavedAddresses(userDoc.data().addresses || []);
        } else {
          setSavedAddresses([]);
        }
      }
    };
  
    fetchAddresses();
  }, []);
  


  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeButtonClick = () => {
    setShowAllAddresses((prevState) => !prevState);
  };
  


  // Handle radio button selection
  const handleCheckboxChange = (address) => {
    setSelectedAddress(address); 
    setShowAllAddresses(false); 
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData); // Check if form data logs correctly
  
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to save your address.");
      navigate("/login");
      return;
    }
  
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      // Retrieve and update existing addresses
      let updatedAddresses = [];
      if (userDoc.exists()) {
        const existingAddresses = userDoc.data().addresses || [];
        updatedAddresses = [...existingAddresses, formData];
        await updateDoc(userRef, { addresses: updatedAddresses });
      } else {
        // If user doesn't exist, create new addresses array
        updatedAddresses = [formData];
        await setDoc(userRef, { addresses: updatedAddresses });
      }
  
      // Update local state and re-render
      setSavedAddresses(updatedAddresses);
      alert("Address saved successfully!");
      setShowAllAddresses(true); // Ensure the addresses are visible
      resetForm();
    } catch (error) {
      console.error("Error saving address: ", error);
      alert("Failed to save address.");
    }
  };
  
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      state: "",
      country: "",
      mobileNo: "",
      pincode: "",
    });
    setIsPopupVisible(false);
  };



useEffect(() => {
    // If no address is selected, default to the first saved address (if any)
    if (!selectedAddress && savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0]);
    }
  }, [selectedAddress, savedAddresses]);


  const handleAddNewAddressClick = () => {
    setFormMode("add");
    setCurrentEditAddress(null); // Clear current address
    setIsPopupVisible(true);
  };


  const handleEditButtonClick = (address) => {
    setFormMode("edit");
    setCurrentEditAddress(address); 
    setIsPopupVisible(true);
  }

const handleSaveAddress = (address) => {
  if (formMode === "add") {
    const newAddress = { id: Date.now(), ...address };
    setSavedAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  } else if (formMode === "edit") {
    // Edit existing address
    setSavedAddresses((prevAddresses) =>
      prevAddresses.map((addr) =>
        addr.id === currentEditAddress.id ? { ...addr, id: currentEditAddress.id } : addr
      )
    );
  }

  // Close the popup
  setIsPopupVisible(false);
};






  return (
 
<div className="container">

<div className="checkout-container">
  {/* Saved Addresses Section */}

  <h1  onClick={() => setShowAllAddresses(!showAllAddresses)}>1. Delivery Address</h1>
{showAddress && (
  <div className="saved-list">
  <h2>Your Addresses</h2>

  {/* Display the selected address */}
  {selectedAddress ? (
  <div className="address-card">
    <div className="address-header">
      <input
        type="radio"
        name="selectedAddress"
        id={`address-${selectedAddress.id}`}
        className="radio-input"
      />
      <label htmlFor={`address-${selectedAddress.id}`} className="radio-label">
        <p className="address-name1">
          {selectedAddress.firstName} |{selectedAddress.lastName} |{" "}
          {selectedAddress.mobileNo}
        </p>
        <p className="address-details1">
          {selectedAddress.addressLine1}, {selectedAddress.addressLine2},{" "}
          {selectedAddress.state}, {selectedAddress.country},{" "}
          {selectedAddress.pincode}
        </p>
      </label>
    </div>
    <button onClick={() => setShowAllAddresses(!showAllAddresses)} className="toggle-button">
      {showAllAddresses ? "Hide" : "Change"}
    </button>
    <button onClick={() => handleEditButtonClick(selectedAddress)} className="edit-button">
      Edit
    </button>
    <p onClick={handleAddNewAddressClick}>Add a new address</p>
  </div>
) : (
  <p>No address selected.</p>
)}
    {/* Show all addresses when "Change" is clicked */}
    {showAllAddresses && savedAddresses.length > 0 && (
 <div className="address-list">
 {savedAddresses.map((address, index) => (
   <div key={index} className="address-card-horizontal">
     <label>
       <input 
         type="radio"
         checked={
           selectedAddress &&
           selectedAddress.firstName === address.firstName
         }
         onChange={() => handleCheckboxChange(address)}
       />
       <div className="address-content">
         <span className="address-title">
           {address.firstName} {address.lastName} | {address.mobileNo}
         </span>
         <span className="address-details">
           {address.addressLine1}, {address.addressLine2}, {address.state},{" "}
           {address.country}, {address.pincode}
         </span>
       </div>
     </label>
   </div>
 ))}
</div>


)}



    {/* Add new address link */}
  

    {/* Popup form for adding new address */}
    {isPopupVisible && (
  <div className="popup-container">
    <div className="form-container">
      <div className="form-header">
        <h2>{formMode === "add" ? "Add New Address" : "Edit Address"}</h2>
        <button className="close-button" onClick={() => setIsPopupVisible(false)}>×</button>
      </div>
 
      <form
  onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const address = Object.fromEntries(formData);
    handleSaveAddress(address);
  }}
>
  <div className="form-grid">
    <label>
      First Name
      <input
        name="firstName"
        defaultValue={formMode === "edit" ? currentEditAddress?.firstName : ""}
        required
      />
    </label>
    <label>
      Last Name
      <input
        name="lastName"
        defaultValue={formMode === "edit" ? currentEditAddress?.lastName : ""}
        required
      />
    </label>
    <label>
      Mobile Number
      <input
        name="mobileNo"
        type="tel"
        defaultValue={formMode === "edit" ? currentEditAddress?.mobileNo : ""}
        required
      />
    </label>
    <label>
      Address Line 1
      <input
        name="addressLine1"
        defaultValue={formMode === "edit" ? currentEditAddress?.addressLine1 : ""}
        required
      />
    </label>
    <label>
      Address Line 2
      <input
        name="addressLine2"
        defaultValue={formMode === "edit" ? currentEditAddress?.addressLine2 : ""}
      />
    </label>
    <label>
      State
      <input
        name="state"
        defaultValue={formMode === "edit" ? currentEditAddress?.state : ""}
        required
      />
    </label>
    <label>
      Country
      <input
        name="country"
        defaultValue={formMode === "edit" ? currentEditAddress?.country : ""}
        required
      />
    </label>
    <label>
      Pincode
      <input
        name="pincode"
        defaultValue={formMode === "edit" ? currentEditAddress?.pincode : ""}
        required
      />
    </label>
  </div>
  <button type="submit" className="save-address">
    {formMode === "add" ? "Add Address" : "Save Changes"}
  </button>
</form>


    </div>
  </div>
)}
  </div>
)}





        {/* Cart Section */}
        <ToastContainer />
        
        <h1 onClick={() => setShowOrderSummary(!showOrderSummary)}>2. Order Summary</h1>
      {showOrderSummary && (
        <div className="order-container">
          <h3 className="total-items">
          Your Cart has ({cart.items.reduce((total, item) => total + item.quantity, 0)}) items
        </h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
  
          <table className="checkout-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Sub Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="checkout-item-image"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  


        {/* Payment Section */}
        <h1 onClick={() => setShowPaymentMethods(!showPaymentMethods)}>3. Payment Methods</h1>
      {showPaymentMethods && (
     <div className="payment-container">
     <div className="input-name">
       <input
       className="radio"
         type="radio"
         id="razorpay"
         name="payment"
         onChange={handleRadioChange}
       />
       <label htmlFor="razorpay" className="razorpay">Razorpay</label>
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

</div>

      {/* Price Details Section */}   
    <div className="price-details-container">
          <h2>Price Details</h2>
          <p>Total MRP: <span>₹{cart.items.reduce((total, item) => total + item.total, 0)}</span></p>
          <p>Additional Shipping Charges: <span>₹900</span></p>
          <p>Total Amount: <span>₹{cart.items.reduce((total, item) => total + item.total, 0) + 900}</span></p>
        </div>
      </div>
  
  );
};

export default Checkout;