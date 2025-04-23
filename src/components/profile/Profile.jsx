import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import { Context } from '../../context/Context';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { userName, setUserName, getUserInitials } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(userName);
  const [errorMessage, setErrorMessage] = useState({ text: "", type: "" });
  const profileCardRef = useRef(null);

  const handleClickOutside = (e) => {
    // If click is on the background (not on the card itself)
    if (profileCardRef.current && !profileCardRef.current.contains(e.target)) {
      navigate('/home');
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSave = async () => {
    if (isLoading) return; // Prevent multiple submit
    
    setIsLoading(true);
    setErrorMessage({ text: "", type: "" });
    
    try {
      // Save name only
      if (name !== userName) {
        setUserName(name);
        localStorage.setItem('userName', name);
      }

      // Show success message
      setErrorMessage({ text: "Profile saved successfully!", type: "success" });
      
      // Navigate back to home with a slight delay to show success message
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessage({ text: error.message || "Something went wrong. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  const handleSignOut = async () => {
    try {
      await logout();
      // Redirect to landing page
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      setErrorMessage({ text: "Failed to sign out. Please try again.", type: "error" });
    }
  };

  return (
    <div className="profile-container" onClick={handleClickOutside}>
      <div className="profile-card" ref={profileCardRef}>
        <div className="profile-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={handleCancel}>×</button>
        </div>

        <div className="profile-picture-section">
          <div className="profile-picture-container">
            <div className="profile-initials">{getUserInitials()}</div>
          </div>
        </div>

        {errorMessage.text && (
          <div className={`profile-message ${errorMessage.type}`}>
            {errorMessage.text}
          </div>
        )}

        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>
          
          <div className="profile-email">
            <strong>Email:</strong> {currentUser?.email || 'Not available'}
          </div>

          <div className="profile-actions">
            <button 
              className="sign-out-button" 
              onClick={handleSignOut}
              disabled={isLoading}
            >
              Sign Out
            </button>
            <div className="right-actions">
              <button 
                className="cancel-button" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="save-button"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 