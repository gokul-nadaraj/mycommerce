import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";

export const Accounts = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser; // Get the currently signed-in user
    if (user) {
      // Set user data from auth
      setUserData({
        username: user.displayName || "Not Provided",
        email: user.email || "Not Provided",
        phone: user.phoneNumber || "Not Provided",
      });
    }
  }, []);

  return (
    <div className="dashboard-container">
      {userData ? (
        <>
          <div className="info">
            <div>
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {userData.phone}
              </p>
            </div>
          </div>

          <div className="Password-container">
            <button>Change Password</button>
          </div>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};
