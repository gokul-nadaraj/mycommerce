import React, { useState } from "react";
import { auth } from "../Components/Firebase/Firebase"; // Ensure this points to your Firebase setup
import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from "firebase/auth";

const ChangeEmail = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User is not authenticated");
        return;
      }

      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Send verification email and update email
      await verifyBeforeUpdateEmail(user, newEmail);
      setSuccess(`Verification email sent to ${newEmail}. Please verify it to complete the update.`);
    } catch (error) {
      console.error("Error changing email:", error);
      setError("Failed to change email. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h4>Change Email</h4>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleEmailChange}>
        <div>
          <label htmlFor="new-email">New Email:</label>
          <input
            type="email"
            id="new-email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="current-password">Current Password:</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ChangeEmail;
