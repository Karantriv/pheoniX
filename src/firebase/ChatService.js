/**
 * chatService.js
 * 
 * Provides functionality for managing user chats in Firebase
 * Includes methods for loading, saving, and migrating chat data
 */
import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  deleteDoc,
  collectionGroup,
  serverTimestamp
} from 'firebase/firestore';

// Collection name for storing user containers
const USERS_COLLECTION = 'users';
// Subcollection name for chats within user container
const CHATS_SUBCOLLECTION = 'chats';

/**
 * Save a chat to Firestore in a user-specific container
 * @param {string} userId - The user ID
 * @param {object} chat - The chat object to save
 * @returns {Promise<string>} - The chat ID
 */
export const saveChat = async (userId, chat) => {
  try {
    if (!userId) {
      console.error('Cannot save chat: No user ID provided');
      return null;
    }

    console.log(`Saving chat for user ${userId}:`, chat.id);

    // Create the path to the user's chats subcollection
    const userChatsRef = collection(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION);
    
    // Create a new document with the chat ID
    const chatDocRef = doc(userChatsRef, chat.id);
    
    // Add user ID and timestamp to the chat data if not already present
    const chatData = {
      ...chat,
      userId,
      timestamp: chat.timestamp || new Date().toISOString()
    };
    
    // Save the chat to Firestore
    await setDoc(chatDocRef, chatData);
    
    console.log('Chat saved successfully:', chat.id);
    return chat.id;
  } catch (error) {
    console.error('Error saving chat:', error);
    return null;
  }
};

/**
 * Get the last 5 chats for a user from their personal container
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of chat objects
 */
export const getUserChats = async (userId) => {
  try {
    if (!userId) {
      console.error('Cannot get chats: No user ID provided');
      return [];
    }

    console.log(`Retrieving chats for user: ${userId}`);

    // Create a query to get the last 5 chats for the user, ordered by timestamp
    const userChatsRef = collection(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION);
    const userChatsQuery = query(
      userChatsRef,
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    
    // Execute the query
    const querySnapshot = await getDocs(userChatsQuery);
    
    // Convert the query snapshot to an array of chat objects
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push(doc.data());
    });
    
    console.log(`Retrieved ${chats.length} chats for user: ${userId}`);
    return chats;
  } catch (error) {
    console.error('Error getting user chats:', error);
    return [];
  }
};

/**
 * Delete older chats when the user has more than 5 chats
 * @param {string} userId - The user ID
 * @returns {Promise<void>}
 */
export const cleanupOldChats = async (userId) => {
  try {
    if (!userId) {
      console.error('Cannot cleanup chats: No user ID provided');
      return;
    }

    console.log(`Cleaning up old chats for user: ${userId}`);

    // Get all chats for the user, ordered by timestamp
    const userChatsRef = collection(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION);
    const userChatsQuery = query(
      userChatsRef,
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(userChatsQuery);
    
    // If the user has more than 5 chats, delete the oldest ones
    if (querySnapshot.size > 5) {
      const chatsToDelete = Array.from(querySnapshot.docs).slice(5);
      
      console.log(`Deleting ${chatsToDelete.length} old chats for user: ${userId}`);
      
      // Delete each chat
      for (const chatDoc of chatsToDelete) {
        await deleteDoc(chatDoc.ref);
        console.log(`Deleted chat: ${chatDoc.id}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up old chats:', error);
  }
};

/**
 * Delete all chats for a user
 * @param {string} userId - The user ID
 * @returns {Promise<void>}
 */
export const deleteAllUserChats = async (userId) => {
  try {
    if (!userId) {
      console.error('Cannot delete chats: No user ID provided');
      return;
    }

    console.log(`Deleting all chats for user: ${userId}`);

    // Get all chats for the user from their container
    const userChatsRef = collection(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION);
    const querySnapshot = await getDocs(userChatsRef);
    
    // Delete each chat
    let deleteCount = 0;
    for (const chatDoc of querySnapshot.docs) {
      await deleteDoc(chatDoc.ref);
      deleteCount++;
    }
    
    console.log(`Deleted ${deleteCount} chats for user: ${userId}`);
  } catch (error) {
    console.error('Error deleting user chats:', error);
  }
};

/**
 * Migrate chats from old format to new user container format
 * @param {string} userId - The user ID
 * @returns {Promise<void>}
 */
export const migrateUserChats = async (userId) => {
  try {
    if (!userId) {
      console.error('Cannot migrate chats: No user ID provided');
      return;
    }

    console.log(`Migrating chats for user: ${userId}`);

    // Query the old collection format
    const oldChatsQuery = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    
    const querySnapshot = await getDocs(oldChatsQuery);
    
    if (querySnapshot.size === 0) {
      console.log(`No chats found to migrate for user: ${userId}`);
      return;
    }
    
    console.log(`Found ${querySnapshot.size} chats to migrate for user: ${userId}`);
    
    // Migrate each chat to the new format
    for (const chatDoc of querySnapshot.docs) {
      const chatData = chatDoc.data();
      
      // Save to new format
      await saveChat(userId, chatData);
      
      // Delete from old format
      await deleteDoc(chatDoc.ref);
    }
    
    console.log(`Migration completed for user: ${userId}`);
  } catch (error) {
    console.error('Error migrating user chats:', error);
  }
};
