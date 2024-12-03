// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { auth, db } from "../Firebase/firebase"; // Adjust im
// import React, { useState, useEffect } from "react";
// const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     addressLine1: "",
//     addressLine2: "",
//     state: "",
//     country: "",
//     mobileNo: "",
//     pincode: "",
//   });
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showAllAddresses, setShowAllAddresses] = useState(false);
//   const navigate = useNavigate();

//   // Fetch saved addresses for the logged-in user
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       const user = auth.currentUser;

//       if (!user) {
//         alert("Please log in to manage your delivery addresses.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const userRef = doc(db, "users", user.uid);
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists()) {
//           setSavedAddresses(userDoc.data().addresses || []);
        
//         }
//       } catch (error) {
//         console.error("Error fetching addresses: ", error);
//       }
//     };

//     fetchAddresses();
//   }, [navigate]);

//   // Handle input changes in the form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const handleChangeButtonClick = () => {
//     setShowAllAddresses(!showAllAddresses); // Toggle to show/hide all addresses
//   };



//   // Handle radio button selection
//   const handleCheckboxChange = (address) => {
//     setSelectedAddress(address); // Set selected address on checkbox click
//     setShowAllAddresses(false); // Hide the list after selecting a new address
//   };

//   // Submit the new address to Firebase
//   const handleSubmitAddress = async (e) => {
//     e.preventDefault();
//     const user = auth.currentUser;

//     if (!user) {
//       alert("Please log in to save your address.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const userRef = doc(db, "users", user.uid);
//       const userDoc = await getDoc(userRef);

//       if (userDoc.exists()) {
//         const existingAddresses = userDoc.data().addresses || [];
//         const updatedAddresses = [...existingAddresses, formData];
//         await updateDoc(userRef, { addresses: updatedAddresses });

//         setSavedAddresses(updatedAddresses);
//         alert("Address saved successfully!");
//         resetForm();
//       }
//     } catch (error) {
//       console.error("Error saving address: ", error);
//       alert("Failed to save address.");
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: "",
//       lastName: "",
//       addressLine1: "",
//       addressLine2: "",
//       state: "",
//       country: "",
//       mobileNo: "",
//       pincode: "",
//     });
//     setIsPopupVisible(false);
//   };



// useEffect(() => {
//     // If no address is selected, default to the first saved address (if any)
//     if (!selectedAddress && savedAddresses.length > 0) {
//       setSelectedAddress(savedAddresses[0]);
//     }
//   }, [selectedAddress, savedAddresses]);





// return(

// <div className="saved-addresses">
//         {/* Button to toggle show all addresses */}
//       <button onClick={handleChangeButtonClick}>
//           {showAllAddresses ? 'Hide' : 'Change'}
//         </button>

//         <h2>Your Addresses</h2>

//         {/* Display the currently selected (previously delivered) address */}
//         {selectedAddress ? (
//           <div className="address-card">
//             <p>{selectedAddress.firstName} {selectedAddress.lastName}</p>
//             <p>{selectedAddress.addressLine1}</p>
//             <p>{selectedAddress.addressLine2}</p>
//             <p>{selectedAddress.state}, {selectedAddress.country}</p>
//             <p>Mobile: {selectedAddress.mobileNo}</p>
//             <p>Pincode: {selectedAddress.pincode}</p>
//           </div>
//         ) : (
//           <p>No address selected</p>
//         )}

//         {/* Show all saved addresses when "Change" is clicked */}
//         {showAllAddresses && (
//           <div className="address-list">
//             {savedAddresses.map((address, index) => (
//               <div key={index} className="address-card">
//                 <label>
//                   <input
//                     type="radio"
//                     checked={selectedAddress && selectedAddress.firstName === address.firstName}
//                     onChange={() => handleCheckboxChange(address)} // Set address on checkbox change
//                   />
//                   <p>{address.firstName} {address.lastName}</p>
//                   <p>{address.addressLine1}</p>
//                   <p>{address.addressLine2}</p>
//                   <p>{address.state}, {address.country}</p>
//                   <p>Mobile: {address.mobileNo}</p>
//                   <p>Pincode: {address.pincode}</p>
//                 </label>
//               </div>
//             ))}
//           </div>
//         )}
  

//       {/* Link to add a new address */}
//       <p onClick={() => setIsPopupVisible(true)}>Add a new address</p>

//       {/* Address Form Popup */}
//       {isPopupVisible && (
//         <div className="popup-container">
//           <div className="form-container">
//             <h2>Shipping Address</h2>
//             <form onSubmit={handleSubmitAddress}>
//               <label>
//                 First Name:
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Last Name:
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Address Line 1:
//                 <input
//                   type="text"
//                   name="addressLine1"
//                   value={formData.addressLine1}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Address Line 2:
//                 <input
//                   type="text"
//                   name="addressLine2"
//                   value={formData.addressLine2}
//                   onChange={handleInputChange}
//                 />
//               </label>
//               <label>
//                 State:
//                 <select
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="" disabled>Select your state</option>
//                   <option value="Tamil Nadu">Tamil Nadu</option>
//                   <option value="Karnataka">Karnataka</option>
//                   <option value="Kerala">Kerala</option>
//                   <option value="Andhra Pradesh">Andhra Pradesh</option>
//                   <option value="Maharashtra">Maharashtra</option>
//                 </select>
//               </label>

//               <label>
//                 Country:
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="" disabled>Select your country</option>
//                   <option value="India">India</option>
//                   <option value="United States">United States</option>
//                   <option value="Canada">Canada</option>
//                   <option value="United Kingdom">United Kingdom</option>
//                   <option value="Australia">Australia</option>
//                 </select>
//               </label>

//               <label>
//                 Mobile Number:
//                 <input
//                   type="tel"
//                   name="mobileNo"
//                   value={formData.mobileNo}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Pincode:
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </label>
//               <button type="submit">Save Address</button>
//             </form>
//           </div>
//         </div>
//       )


















///


<h1 onClick={() => setShowAddress(!showAddress)}>1. Delivery Address</h1>
{showAddress && (
  <div className="saved-addresses">
      <button onClick={handleChangeButtonClick}>
      {showAllAddresses ? 'Hide' : 'Change'}
    </button>
    <h2>Your Addresses</h2>
    {selectedAddress ? (
      <div className="address-card">
        <p>{selectedAddress.firstName} {selectedAddress.lastName}</p>
        <p>{selectedAddress.addressLine1}</p>
        <p>{selectedAddress.addressLine2}</p>
        <p>{selectedAddress.state}, {selectedAddress.country}</p>
        <p>Mobile: {selectedAddress.mobileNo}</p>
        <p>Pincode: {selectedAddress.pincode}</p>
  
      </div>
    ) : (
      <p>No address selected</p>
    )}
    {showAllAddresses && (
      <div className="address-list">
        {[] /* Replace with your address list */.map((address, index) => (
          <div key={index} className="address-card">
            <label>
              <input
                type="radio"
                checked={selectedAddress && selectedAddress.firstName === address.firstName}
                onChange={() => handleCheckboxChange(address)}
              />
              <p>{address.firstName} {address.lastName}</p>
              <p>{address.addressLine1}</p>
              <p>{address.addressLine2}</p>
              <p>{address.state}, {address.country}</p>
              <p>Mobile: {address.mobileNo}</p>
              <p>Pincode: {address.pincode}</p>
            </label>
          </div>
        ))}
      </div>
    )}
    <p onClick={() => setIsPopupVisible(true)}>Add a new address</p>
    {isPopupVisible && (
      <div className="popup-container">
<div className="form-container">
<div className="form-header">
<h2>Shipping Address</h2>
<button className="close-button" onClick={() => setIsPopupVisible(false)}>✖</button>
</div>
<form onSubmit={handleSubmitAddress}>
<div className="form-grid">
{/* First Name and Last Name */}
<label>
  First Name:
  <input
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={handleInputChange}
    required
  />
</label>
<label>
  Last Name:
  <input
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={handleInputChange}
    required
  />
</label>

{/* Address Line 1 and Address Line 2 */}
<label>
  Address Line 1:
  <input
    type="text"
    name="addressLine1"
    value={formData.addressLine1}
    onChange={handleInputChange}
    required
  />
</label>
<label>
  Address Line 2:
  <input
    type="text"
    name="addressLine2"
    value={formData.addressLine2}
    onChange={handleInputChange}
  />
</label>

{/* Mobile Number */}
<label>
  Mobile Number:
  <input
    type="tel"
    name="mobileNo"
    value={formData.mobileNo}
    onChange={handleInputChange}
    required
  />
</label>

{/* State and Country */}
<label>
  State:
  <select
    name="state"
    value={formData.state}
    onChange={handleInputChange}
    required
  >
    <option value="" disabled>Select your state</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
  </select>
</label>
<label>
  Country:
  <select
    name="country"
    value={formData.country}
    onChange={handleInputChange}
    required
  >
    <option value="" disabled>Select your country</option>
    <option value="India">India</option>
    <option value="United States">United States</option>
    <option value="Canada">Canada</option>
    <option value="United Kingdom">United Kingdom</option>
    <option value="Australia">Australia</option>
  </select>
</label>

{/* District and Pincode */}
<label>
  District:
  <input
    type="text"
    name="district"
    value={formData.district}
    onChange={handleInputChange}
    required
  />
</label>
<label>
  Pincode:
  <input
    type="text"
    name="pincode"
    value={formData.pincode}
    onChange={handleInputChange}
    required
  />
</label>
</div>
<button type="submit"className="save-address">Use This Address</button>
</form>
</div>

      </div>
    )}
  </div>
)}