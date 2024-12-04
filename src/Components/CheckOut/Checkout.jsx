import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { auth, db } from "../Firebase/Firebase";
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
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
  
        const userRef = doc(db, "users", user.uid); // Reference to the user document in Firestore
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          setSavedAddresses(userDoc.data()?.addresses || []);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        alert("Failed to load addresses. Please refresh the page.");
      }
    };
  
    fetchAddresses();
  }, []); // Run only once on component mount
  


  // Handle input changes in the form
  const handleSubmitAddress = async (newAddress) => {
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to save your address.");
      navigate("/login");
      return;
    }
  
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      const updatedAddresses = [...(userDoc.data()?.addresses || [])];
  
      // Add new address with a unique `id` if not editing
      if (formMode === "add") {
        newAddress.id = Date.now(); // Generate a unique ID
        updatedAddresses.push(newAddress);
      } else if (formMode === "edit") {
        // Update only the address being edited
        updatedAddresses.forEach((address, index) => {
          if (address.id === currentEditAddress?.id) {
            updatedAddresses[index] = { ...address, ...newAddress };
          }
        });
      }
  
      // Update the database
      await updateDoc(userRef, { addresses: updatedAddresses });
  
      // Update the local state
      setSavedAddresses(updatedAddresses);
      alert(formMode === "add" ? "Address added successfully!" : "Address updated successfully!");
      setIsPopupVisible(false); // Close the popup
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
  };

  const handleUpdateSelectedAddress = async (updatedAddress) => {
    console.log("Edited address:", updatedAddress);
  

    const updatedSavedAddresses = savedAddresses.map((address) =>
      address.id === updatedAddress.id ? { ...address, ...updatedAddress } : address
    );
  
    console.log("Before update:", savedAddresses);
    console.log("After update:", updatedSavedAddresses);
  

    setSavedAddresses(updatedSavedAddresses);
  
  
    if (selectedAddress?.id === updatedAddress.id) {
      setSelectedAddress({ ...selectedAddress, ...updatedAddress });
    }
  
    // Save the updated addresses to the database
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");
  
      const userRef = doc(db, "users", user.uid); // Reference to the user document in Firestore
      await updateDoc(userRef, { addresses: updatedSavedAddresses }); // Update the addresses field in Firestore
  
      console.log("Address list updated in database.");
    } catch (error) {
      console.error("Failed to update addresses in database:", error);
      alert("Failed to save changes. Please try again.");
    }
  
    setIsPopupVisible(false); // Close the popup
  };
  

  const handleDeleteAddress = async (index) => {
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to delete your address.");
      navigate("/login");
      return;
    }
  
    try {
      // Get the address to delete
      const addressToDelete = savedAddresses[index];
  
      // Update the local state by removing the address
      const updatedAddresses = savedAddresses.filter((_, i) => i !== index);
  
      // Update the database
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { addresses: updatedAddresses });
  
      // Update the local state
      setSavedAddresses(updatedAddresses);
  
      // Clear the selected address if it was the one deleted
      if (selectedAddress && selectedAddress.id === addressToDelete.id) {
        setSelectedAddress(null);
      }
  
      alert("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address: ", error);
      alert("Failed to delete the address.");
    }
  };
  




  return (
 
<div className="container">

<div className="checkout-container">

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
            name="address" 
            className="radio-input1"
            checked={selectedAddress?.id === address.id} // Mark selected address
            onChange={() => setSelectedAddress(address)} // Update selectedAddress state on selection
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
          <button
            className="delete-button"
            onClick={() => handleDeleteAddress(index)} // Trigger the delete function
          >
            Delete
          </button>
        </label>

        {selectedAddress?.id === address.id && (
          <button
            className="use"
            onClick={() => {
              if (selectedAddress) {
                // Update the selected address and close the address list
                console.log("Selected Address:", selectedAddress); // Optional: Log the selected address
                setShowAllAddresses(false); // Close the address list
              } else {
                alert("Please select an address first.");
              }
            }}
          >
            Use This Location
          </button>
        )}
      </div>
    ))}
  </div>
)}



    {/* Popup form for adding new address */}
    {isPopupVisible && (
  <div className="popup-container">
    <div className="form-container">
      <div className="form-header">
        <h2 className="added">{formMode === "add" ? "Add New Address" : "Edit Address"}</h2>
        <button className="close-button" onClick={() => setIsPopupVisible(false)}>×</button>
      </div>
 
      <form
  onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const address = Object.fromEntries(formData);

    if (formMode === "edit") {

      address.id = currentEditAddress?.id;
      handleUpdateSelectedAddress(address); 
    } else if (formMode === "add") {
      const newAddress = { ...address, id: Date.now() };
      handleSubmitAddress(newAddress); // Add the new address
    }

    resetForm(); 
  }}
>


  
    {/* Form Fields */}
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