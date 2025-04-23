/**
 * userEvent.js
 * 
 * Handles user authentication event management
 * Provides a centralized system for subscribing to user state changes
 */
import { auth } from './config';
import { onAuthStateChanged } from 'firebase/auth';

const userChangeListeners = [];
let currentUser = null;

/**
 * Initialize the user event system
 * This should be called once at application startup
 */
export const initUserEvents = () => {
  // Set up the auth state listener
  onAuthStateChanged(auth, (user) => {
    // Get user ID or null
    const userId = user ? user.uid : null;
    
    // Store the current user state
    currentUser = user;
    
    // Notify all listeners
    console.log(`User state changed: ${userId ? 'logged in' : 'logged out'}`);
    notifyUserChangeListeners(userId);
  });
  
  console.log('User event system initialized');
};

/**
 * Add a listener for user changes
 * @param {Function} callback - Function to call when user state changes
 * @returns {Function} - Function to remove the listener
 */
export const addUserChangeListener = (callback) => {
  if (typeof callback !== 'function') {
    console.error('addUserChangeListener requires a callback function');
    return () => {};
  }
  
  userChangeListeners.push(callback);
  
  // Immediately call with current user if available
  if (currentUser !== undefined) {
    const userId = currentUser ? currentUser.uid : null;
    setTimeout(() => callback(userId), 0);
  }
  
  // Return a function to remove this listener
  return () => {
    const index = userChangeListeners.indexOf(callback);
    if (index !== -1) {
      userChangeListeners.splice(index, 1);
    }
  };
};

/**
 * Get the current user ID
 * @returns {string|null} - The current user ID or null if not logged in
 */
export const getCurrentUserId = () => {
  return currentUser ? currentUser.uid : null;
};

/**
 * Dispatch a user change event manually
 * @param {string|null} oldUserId - The previous user ID
 * @param {string|null} newUserId - The new user ID
 */
export const dispatchUserChangeEvent = (oldUserId, newUserId) => {
  console.log(`Manually dispatching user change: ${oldUserId || 'none'} -> ${newUserId || 'none'}`);
  
  // Update the current user ID
  if (newUserId !== oldUserId) {
    notifyUserChangeListeners(newUserId);
  }
};

/**
 * Notify all listeners of a user change
 * @param {string|null} userId - The user ID or null if logged out
 */
const notifyUserChangeListeners = (userId) => {
  userChangeListeners.forEach(callback => {
    try {
      callback(userId);
    } catch (error) {
      console.error('Error in user change listener:', error);
    }
  });
};



