import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, storage, db } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfilePic, setUserProfilePic] = useState(null);

  async function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    const googleprovider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleprovider);
  }

  function loginWithGithub() {
    const githubprovider = new GithubAuthProvider();
    return signInWithPopup(auth, githubprovider);
  }

  function logout() {
    return signOut(auth);
  }

  async function uploadProfilePicture(file, userId) {
    if (!file) {
      console.error("No file provided for upload");
      return { error: "No file provided for upload" };
    }
    
    try {
      console.log("Starting profile picture upload for user:", userId);
      console.log("File info:", file.name, file.type, file.size);
      
      // Create a unique file name with timestamp to avoid cache issues
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `user_${userId}_${timestamp}.${fileExtension}`;
      
      // Create a reference with the unique file name in the Profiles folder
      const fileRef = ref(storage, `Profiles/${fileName}`);
      console.log("Storage reference created for:", fileName);
      
      // Convert to blob for more reliable upload
      let fileBlob;
      try {
        // Get file as ArrayBuffer and convert to Blob
        const fileArrayBuffer = await file.arrayBuffer();
        fileBlob = new Blob([fileArrayBuffer], { type: file.type });
        console.log("File converted to blob successfully, size:", fileBlob.size);
      } catch (blobError) {
        console.error("Error converting file to blob:", blobError);
        // Fall back to original file if blob conversion fails
        fileBlob = file;
      }
      
      // Upload the file
      console.log("Uploading file...");
      const uploadResult = await uploadBytes(fileRef, fileBlob);
      console.log("File uploaded successfully:", uploadResult.metadata.fullPath);
      
      // Get download URL
      console.log("Getting download URL...");
      const downloadURL = await getDownloadURL(fileRef);
      console.log("Download URL obtained:", downloadURL);
      
      // Update Auth profile first
      if (auth.currentUser) {
        console.log("Updating user profile in Auth");
        try {
          await updateProfile(auth.currentUser, {
            photoURL: downloadURL
          });
          console.log("Auth profile updated successfully");
        } catch (authUpdateError) {
          console.error("Error updating Auth profile:", authUpdateError);
          // Continue with Firestore update even if Auth update fails
        }
      }
      
      // Then update Firestore
      try {
        console.log("Storing profile picture URL in Firestore");
        await setDoc(doc(db, "userProfiles", userId), {
          photoURL: downloadURL,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log("Firestore document updated successfully");
      } catch (firestoreError) {
        console.error("Error updating Firestore:", firestoreError);
        // Still return URL if we have it, even if Firestore update fails
      }
      
      // Update local state
      setUserProfilePic(downloadURL);
      console.log("Profile picture update complete");
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      console.error("Error details:", error.code, error.message);
      
      // Provide more specific error messages based on Firebase Storage error codes
      let errorMessage = error.message || "Failed to upload profile picture";
      if (error.code === 'storage/unauthorized') {
        errorMessage = "You don't have permission to upload files. Check Firebase Storage rules.";
      } else if (error.code === 'storage/canceled') {
        errorMessage = "Upload was canceled";
      } else if (error.code === 'storage/unknown') {
        errorMessage = "Unknown error occurred during upload. Please try again.";
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = "Storage quota exceeded. Contact the administrator.";
      }
      
      return { error: errorMessage };
    }
  }

  async function getProfilePicture(userId) {
    try {
      // First try to get from Auth
      if (auth.currentUser && auth.currentUser.photoURL) {
        setUserProfilePic(auth.currentUser.photoURL);
        return auth.currentUser.photoURL;
      }
      
      // If not available, try Firestore
      const userDoc = await getDoc(doc(db, "userProfiles", userId));
      if (userDoc.exists() && userDoc.data().photoURL) {
        setUserProfilePic(userDoc.data().photoURL);
        return userDoc.data().photoURL;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting profile picture:", error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await getProfilePicture(user.uid);
      } else {
        setUserProfilePic(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfilePic,
    signup,
    login,
    loginWithGoogle,
    loginWithGithub,
    logout,
    uploadProfilePicture,
    getProfilePicture
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}