import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

/**
 * Simple direct upload function for profile pictures to the Profiles folder
 * @param {File} file - The file to upload
 * @param {string} userId - The user ID to use in the filename
 * @returns {Promise<{success: boolean, message: string, downloadURL?: string, error?: any}>}
 */
export const directUploadProfilePicture = async (file, userId) => {
  if (!file) {
    console.error("No file provided for direct upload");
    return { success: false, message: "No file provided" };
  }
  
  try {
    console.log("Starting direct profile picture upload");
    console.log("User ID:", userId);
    console.log("File info:", file.name, file.type, file.size);
    
    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `user_${userId}_${timestamp}.${fileExtension}`;
    
    // Use the Profiles folder instead of profilePictures
    const filePath = `Profiles/${fileName}`;
    
    console.log(`Creating reference to file: ${filePath}`);
    const fileRef = ref(storage, filePath);
    
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
    
    // Upload the file directly
    console.log("Directly uploading file...");
    const snapshot = await uploadBytes(fileRef, fileBlob);
    console.log("Direct upload successful:", snapshot);
    
    // Get the download URL
    console.log("Getting download URL...");
    const downloadURL = await getDownloadURL(fileRef);
    console.log("Download URL retrieved:", downloadURL);
    
    return {
      success: true,
      message: "Direct upload completed successfully",
      downloadURL
    };
  } catch (error) {
    console.error("Direct upload failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Provide more specific error messages based on Firebase Storage error codes
    let errorMessage = error.message;
    if (error.code === 'storage/unauthorized') {
      errorMessage = "You don't have permission to upload files. Check Firebase Storage rules.";
    } else if (error.code === 'storage/canceled') {
      errorMessage = "Upload was canceled.";
    } else if (error.code === 'storage/unknown') {
      errorMessage = "Unknown error occurred during upload.";
    } else if (error.code === 'storage/quota-exceeded') {
      errorMessage = "Storage quota exceeded. Contact the administrator.";
    }
    
    return {
      success: false,
      message: errorMessage,
      error: error
    };
  }
}; 