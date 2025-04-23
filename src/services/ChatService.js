/**
 * ChatService.js
 * 
 * Service to handle chat data operations including:
 * - Loading/saving chats
 * - User-specific chat storage
 * - Migration of legacy chat data
 */
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { dispatchUserChange } from '../firebase/userEvent';

// Constants
const LEGACY_CHATS_KEY = 'chatHistory';
const USER_CHATS_COLLECTION = 'userChats';

/**
 * Load all chats for a specific user from Firestore
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of chat objects
 */
export const loadUserChats = async (userId) => {
  if (!userId) {
    console.error('Cannot load chats: No user ID provided');
    return [];
  }

  try {
    const db = getFirestore();
    const userChatsRef = collection(db, USER_CHATS_COLLECTION);
    const q = query(userChatsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Loaded ${chats.length} chats for user ${userId}`);
    return chats;
  } catch (error) {
    console.error('Error loading user chats:', error);
    return [];
  }
};

/**
 * Save a chat for a specific user to Firestore
 * @param {string} userId - The user ID
 * @param {Object} chat - The chat object to save
 * @returns {Promise<string>} - The chat ID
 */
export const saveUserChat = async (userId, chat) => {
  if (!userId) {
    console.error('Cannot save chat: No user ID provided');
    return null;
  }

  try {
    const db = getFirestore();
    const chatId = chat.id || Math.random().toString(36).substring(2, 15);
    const chatWithUser = {
      ...chat,
      userId,
      updatedAt: new Date().toISOString(),
      id: chatId
    };
    
    const chatRef = doc(db, USER_CHATS_COLLECTION, chatId);
    await setDoc(chatRef, chatWithUser);
    
    console.log(`Saved chat ${chatId} for user ${userId}`);
    return chatId;
  } catch (error) {
    console.error('Error saving user chat:', error);
    return null;
  }
};

/**
 * Delete a chat for a specific user
 * @param {string} chatId - The chat ID to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteUserChat = async (chatId) => {
  if (!chatId) {
    console.error('Cannot delete chat: No chat ID provided');
    return false;
  }

  try {
    const db = getFirestore();
    const chatRef = doc(db, USER_CHATS_COLLECTION, chatId);
    await deleteDoc(chatRef);
    
    console.log(`Deleted chat ${chatId}`);
    return true;
  } catch (error) {
    console.error('Error deleting user chat:', error);
    return false;
  }
};

/**
 * Check if the user has legacy chats in localStorage
 * @returns {boolean} - True if legacy chats exist
 */
export const hasLegacyChats = () => {
  const legacyChats = localStorage.getItem(LEGACY_CHATS_KEY);
  return legacyChats && legacyChats !== '[]';
};

/**
 * Migrate legacy chats from localStorage to user-specific storage in Firestore
 * @param {string} userId - The user ID to migrate chats to
 * @returns {Promise<Array>} - The migrated chats
 */
export const migrateUserChats = async (userId) => {
  if (!userId) {
    console.error('Cannot migrate chats: No user ID provided');
    return [];
  }

  // Check if there are legacy chats to migrate
  if (!hasLegacyChats()) {
    console.log('No legacy chats to migrate');
    return [];
  }

  try {
    // Get legacy chats from localStorage
    const legacyChatsJson = localStorage.getItem(LEGACY_CHATS_KEY);
    const legacyChats = JSON.parse(legacyChatsJson || '[]');
    
    if (!legacyChats.length) {
      return [];
    }
    
    console.log(`Found ${legacyChats.length} legacy chats to migrate`);
    
    // Save each chat to the user's collection
    const migratedChats = [];
    for (const chat of legacyChats) {
      const chatWithTimestamp = {
        ...chat,
        migratedAt: new Date().toISOString(),
        createdAt: chat.timestamp || new Date().toISOString()
      };
      
      const chatId = await saveUserChat(userId, chatWithTimestamp);
      if (chatId) {
        migratedChats.push({
          id: chatId,
          ...chatWithTimestamp
        });
      }
    }
    
    // Clear legacy chats from localStorage
    localStorage.setItem(LEGACY_CHATS_KEY, '[]');
    
    console.log(`Successfully migrated ${migratedChats.length} chats for user ${userId}`);
    return migratedChats;
  } catch (error) {
    console.error('Error migrating user chats:', error);
    return [];
  }
}; 