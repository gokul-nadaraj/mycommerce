import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "./Checkout.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Payment from "../Payment/Payment";
import Order from "../Order/Order";

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
  const handleSubmitAddress = async (address) => {
    console.log("Form Data Submitted:", address); // Check if form data logs correctly
  
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
        updatedAddresses = [...existingAddresses, address];
        await updateDoc(userRef, { addresses: updatedAddresses });
      } else {
        // If user doesn't exist, create new addresses array
        updatedAddresses = [address];
        await setDoc(userRef, { addresses: updatedAddresses });
      }
  
      // Update local state
      setSavedAddresses(updatedAddresses);
      alert("Address saved successfully!");
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
    const newAddress = {
      id: formMode === "edit" ? currentEditAddress.id : Date.now(),
      ...address,
    };
  
    if (formMode === "add") {
      setSavedAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    } else if (formMode === "edit") {
      setSavedAddresses((prevAddresses) =>
        prevAddresses.map((addr) =>
          addr.id === currentEditAddress.id ? newAddress : addr
        )
      );
    }
  
    setIsPopupVisible(false); // Close the popup
  };
  





  return (
 
<div className="container">

<div className="checkout-container">
  {/* Saved Addresses Section */}

  <h1  onClick={() => setShowAllAddresses(!showAllAddresses)} className="header">1. Delivery Address</h1>
{showAddress && (
  <div className="saved-list">

  {/* Display the selected address */}
  {selectedAddress ? (
  <div className="address-card">
    <div className="address-header">
      <input
        type="radio"
        name="selectedAddress"
        id={`address-${selectedAddress.id}`}
        className="radio-input"
        checked
        readOnly // This ensures the radio button reflects the selected address
      />
      <label htmlFor={`address-${selectedAddress.id}`} className="radio-label">
        <p className="address-name1">
          {selectedAddress.firstName} |{selectedAddress.lastName} |{" "}
          {selectedAddress.mobileNo}
        </p>
        <p className="address-details1">
          {selectedAddress.addressLine1}, {selectedAddress.addressLine2}, {selectedAddress.state},{" "}
          {selectedAddress.country}, {selectedAddress.pincode}
        </p>
      </label>
    </div>
    <button onClick={() => setShowAllAddresses(!showAllAddresses)} className="toggle">
      {showAllAddresses ? "Hide" : "Change"}
    </button>
    <button onClick={() => handleEditButtonClick(selectedAddress)} className="edit-button">
      Edit
    </button>
  </div>
) : (
  <p>No address selected.</p>
)}

<p onClick={handleAddNewAddressClick}>Add a new address</p>

{/* Show all addresses when "Change" is clicked */}
{showAllAddresses && savedAddresses.length > 0 && (
  <div className="address-list">
    {savedAddresses.map((address, index) => (
      <div key={index} className="address-card-horizontal">
        <label>
          <input
            type="radio"
            name="address" // Grouping the radio buttons
            className="radio-input1"
           // Check if this address is selected
            onChange={() => setSelectedAddress(address)} // Update selectedAddress when clicked
          />
          <div className="address-content">
            <span className="address-title">
              {address.firstName} | {address.lastName} | {address.mobileNo}
            </span>
            <span className="address-details">
              {address.addressLine1}, {address.addressLine2}, {address.state},{" "}
              {address.country}, {address.pincode}
            </span>
          </div>
        </label>
      </div>
    ))}

    <button className="use"
          onClick={() => {
            
            setSelectedAddress(selectedAddress);
            setShowAllAddresses(false); 
          }}
        >
          Use This Location
        </button>

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
   onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const address = Object.fromEntries(formData);

    // Save address locally
    handleSaveAddress(address);

    // Save address to Firestore
    await handleSubmitAddress(address);

    // Close popup and reset form
    resetForm();
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
      
      <Order/>  

<Payment/>



      {/* Price Details Section */}   

  </div>
  <div className="price-details-container">
          <h2>Price Details</h2>

          <div className="total-details">
          <p>Total MRP:</p>
          <span>₹{cart.items.reduce((total, item) => total + item.total, 0)}</span>

          </div>

          <div className="total-details">
          <p>Additional Shipping Charges:</p>
          <span>₹900</span>
          </div>
<div className="total-details1">
<p className="amount">Total Amount:</p>
<span>₹{cart.items.reduce((total, item) => total + item.total, 0) + 900}</span>
</div>

</div>

  </div>
  
  );
};

export default Checkout;