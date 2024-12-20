import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import ChangePassword from "../PasswordChange/password"; // Import ChangePassword component
import ChangeEmail from "../ChangeEmail/"; // Import ChangeEmail component
import "./Accounts.css";
import web from "/images/web.png";

const Accounts = () => {
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState("main"); // "main", "password", or "email"

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        username: user.displayName || "Not Provided",
        email: user.email || "Not Provided",
        phone: user.phoneNumber || "Not Provided",
      });
    }
  }, []);

  return (
    <div className="main">
      <div className="contact-info">
        <p>Contact Information</p>
        {userData ? (
          <div className="info">
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {userData.phone}
            </p>
            <div className="Password-container">
              <button onClick={() => setCurrentView("password")}>
                Change Password
              </button>
              <button onClick={() => setCurrentView("email")}>
                Change Email
              </button>
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="main-img">
        {/* Conditional rendering for forms */}
        {currentView === "main" && (
          <div className="main-img">
            <img src={web} alt="open" />
          </div>
        )}
        {currentView === "password" && <ChangePassword />}
        {currentView === "email" && <ChangeEmail />}
      </div>
    </div>
  );
};

export default Accounts;
