import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

// Function to test storage upload capabilities
export const testStorageUpload = async () => {
  try {
    console.log("Starting Firebase Storage test...");
    
    // Create a test data string (a tiny base64 image)
    const testData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    
    // Generate a unique test file name
    const testFileName = `test_${new Date().getTime()}.png`;
    const testFilePath = `Profiles/tests/${testFileName}`;
    
    console.log(`Creating reference to test file: ${testFilePath}`);
    const testFileRef = ref(storage, testFilePath);
    
    // Upload the test data
    console.log("Uploading test data...");
    const snapshot = await uploadString(testFileRef, testData, 'data_url');
    console.log("Test upload successful:", snapshot);
    
    // Try to get the download URL
    console.log("Getting download URL...");
    const downloadURL = await getDownloadURL(testFileRef);
    console.log("Test download URL retrieved:", downloadURL);
    
    return {
      success: true,
      message: "Firebase Storage test passed successfully",
      downloadURL
    };
  } catch (error) {
    console.error("Firebase Storage test failed:", error);
    return {
      success: false,
      message: `Storage test failed: ${error.message}`,
      error
    };
  }
};

export default testStorageUpload; 