/**
 * chatMigration.js
 * 
 * Handles the migration process for user chats when logging in
 * Connects the userEvent system with the ChatService
 */
import { addUserChangeListener } from './userEvent';
import { hasLegacyChats, migrateUserChats, loadUserChats } from '../services/ChatService';

let migrationInProgress = false;

/**
 * Initialize the chat migration system
 * @param {Function} onChatsLoaded - Callback function when chats are loaded or migrated
 */
export const initChatMigration = (onChatsLoaded) => {
  if (typeof onChatsLoaded !== 'function') {
    console.error('initChatMigration requires a callback function');
    return;
  }

  // Listen for user changes to trigger migration if needed
  addUserChangeListener(async (userId) => {
    if (!userId) {
      // User logged out, clear state
      onChatsLoaded([]);
      return;
    }

    // Check if we need to migrate legacy chats
    if (hasLegacyChats() && !migrationInProgress) {
      await handleChatMigration(userId, onChatsLoaded);
    } else {
      // No migration needed, just load the user's chats
      const userChats = await loadUserChats(userId);
      onChatsLoaded(userChats || []);
    }
  });

  console.log('Chat migration system initialized');
};

/**
 * Handle the chat migration process for a user
 * @param {string} userId - The user ID
 * @param {Function} onComplete - Callback function when migration completes
 * @returns {Promise<Array>} - The user's chats (migrated + existing)
 */
const handleChatMigration = async (userId, onComplete) => {
  if (migrationInProgress) {
    console.log('Migration already in progress');
    return;
  }

  try {
    migrationInProgress = true;
    console.log(`Starting chat migration for user ${userId}`);
    
    // Load existing chats first
    const existingChats = await loadUserChats(userId);
    
    // Migrate legacy chats
    const migratedChats = await migrateUserChats(userId);
    
    // Combine existing and migrated chats
    const allChats = [...existingChats, ...migratedChats].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || a.timestamp || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || b.timestamp || 0);
      return dateB - dateA; // Sort by newest first
    });
    
    migrationInProgress = false;
    
    // Call the callback with all chats
    if (typeof onComplete === 'function') {
      onComplete(allChats);
    }
    
    console.log(`Chat migration complete. Migrated ${migratedChats.length} chats.`);
    return allChats;
  } catch (error) {
    migrationInProgress = false;
    console.error('Error during chat migration:', error);
    
    // Still try to load existing chats if migration fails
    const fallbackChats = await loadUserChats(userId);
    if (typeof onComplete === 'function') {
      onComplete(fallbackChats);
    }
    
    return fallbackChats;
  }
}; 