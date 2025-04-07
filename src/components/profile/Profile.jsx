import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/AuthContext';
import { Context } from '../../context/Context';
import testStorageUpload from '../../firebase/StorageTester';
import { directUploadProfilePicture } from '../../firebase/DirectUploader';
import './Profile.css';
import { assets } from '../../assets/assets';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, uploadProfilePicture, userProfilePic } = useAuth();
  const { userName, setUserName, updateUserProfilePic, getUserInitials } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(userName);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState({ text: "", type: "" });
  const [isTestingStorage, setIsTestingStorage] = useState(false);
  const [isDirectUpload, setIsDirectUpload] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Set preview from existing profile pic if available
    if (userProfilePic) {
      setPreviewUrl(userProfilePic);
    }
  }, [userProfilePic]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage({ text: "File is too large. Please select an image under 2MB.", type: "error" });
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setErrorMessage({ text: "Please select a valid image file (JPEG, PNG, or GIF)", type: "error" });
        return;
      }
      
      setErrorMessage({ text: "", type: "" });
      setSelectedFile(file);
      
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage({ text: "", type: "" });
  };

  // Function to test Firebase storage functionality
  const handleTestStorage = async () => {
    setIsTestingStorage(true);
    setErrorMessage({ text: "Testing storage connectivity...", type: "info" });
    
    try {
      const result = await testStorageUpload();
      
      if (result.success) {
        setErrorMessage({ 
          text: "Storage test passed! You should be able to upload images now.", 
          type: "success" 
        });
      } else {
        setErrorMessage({ 
          text: `Storage test failed: ${result.message}. Please check your Firebase settings.`, 
          type: "error" 
        });
      }
    } catch (error) {
      setErrorMessage({ 
        text: `Storage test error: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setIsTestingStorage(false);
    }
  };

  // Function to directly upload a profile picture bypassing AuthContext
  const handleDirectUpload = async () => {
    if (!selectedFile || !currentUser) {
      setErrorMessage({ text: "Please select a file first", type: "error" });
      return;
    }
    
    setIsDirectUpload(true);
    setErrorMessage({ text: "Directly uploading image... This may take a moment.", type: "info" });
    
    try {
      const result = await directUploadProfilePicture(selectedFile, currentUser.uid);
      
      if (result.success) {
        console.log("Direct upload successful:", result.downloadURL);
        setErrorMessage({ 
          text: "Direct upload successful! URL: " + result.downloadURL.substring(0, 20) + "...", 
          type: "success" 
        });
        
        // Update the profile picture in the app
        updateUserProfilePic(result.downloadURL);
      } else {
        setErrorMessage({ 
          text: `Direct upload failed: ${result.message}`, 
          type: "error" 
        });
      }
    } catch (error) {
      setErrorMessage({ 
        text: `Direct upload error: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setIsDirectUpload(false);
    }
  };

  const handleSave = async () => {
    if (isLoading) return; // Prevent multiple submit
    
    setIsLoading(true);
    setErrorMessage({ text: "", type: "" });
    
    try {
      // Save name first
      if (name !== userName) {
        setUserName(name);
        localStorage.setItem('userName', name);
      }

      // Save profile picture if selected
      if (selectedFile && currentUser) {
        console.log("Attempting to upload profile picture");
        
        // Show user that upload is happening
        setErrorMessage({ text: "Uploading image... This may take a moment.", type: "info" });
        
        const result = await uploadProfilePicture(selectedFile, currentUser.uid);
        
        // Check if we received an error object instead of a URL
        if (result && result.error) {
          throw new Error(result.error);
        }
        
        if (result) {
          console.log("Profile picture uploaded successfully, URL:", result);
          updateUserProfilePic(result);
          setErrorMessage({ text: "Profile picture uploaded successfully!", type: "success" });
        } else {
          throw new Error("Failed to get download URL for the uploaded file");
        }
      }

      // Show success message
      setErrorMessage({ text: "Profile saved successfully!", type: "success" });
      
      // Navigate back to home with a slight delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrorMessage({ text: error.message || "Something went wrong. Please try again.", type: "error" });
    } finally {
      setIsLoading(false); // Always reset loading state whether successful or not
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={handleCancel}>×</button>
        </div>

        <div className="profile-picture-section">
          <div className="profile-picture-container">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-initials">{getUserInitials()}</div>
            )}
            <div className="picture-actions">
              <button className="picture-button upload" onClick={handleFileSelect} disabled={isLoading || isTestingStorage || isDirectUpload}>
                Upload Picture
              </button>
              {previewUrl && (
                <button className="picture-button remove" onClick={handleRemovePicture} disabled={isLoading || isTestingStorage || isDirectUpload}>
                  Remove
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
                disabled={isLoading || isTestingStorage || isDirectUpload}
              />
              {selectedFile && (
                <button 
                  className="picture-button direct" 
                  onClick={handleDirectUpload}
                  disabled={isLoading || isTestingStorage || isDirectUpload}
                >
                  {isDirectUpload ? "Uploading..." : "Direct Upload"}
                </button>
              )}
            </div>
            <button 
              className="picture-button test" 
              onClick={handleTestStorage}
              disabled={isLoading || isTestingStorage || isDirectUpload}
            >
              {isTestingStorage ? "Testing..." : "Test Upload"}
            </button>
            {errorMessage.text && (
              <div className={`error-message ${errorMessage.type}`}>
                {errorMessage.text}
              </div>
            )}
          </div>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              disabled={isLoading || isTestingStorage || isDirectUpload}
            />
          </div>
          
          <div className="profile-email">
            <strong>Email:</strong> {currentUser?.email || 'Not available'}
          </div>

          <div className="profile-actions">
            <button 
              className="cancel-button" 
              onClick={handleCancel}
              disabled={isLoading || isTestingStorage || isDirectUpload}
            >
              Cancel
            </button>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={isLoading || isTestingStorage || isDirectUpload}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 