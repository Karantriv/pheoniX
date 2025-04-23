import React, { useState, useEffect } from 'react';
import { checkForLegacyChats, migrateLegacyChats } from '../firebase/chatService';
import { addUserChangeListener } from '../firebase/userEvent';
import '../styles/ChatMigration.css';

/**
 * Component that handles chat migration when a user logs in
 * Shows a modal when legacy chats are detected and allows migration
 */
function ChatMigration() {
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Listen for user changes
  useEffect(() => {
    const unsubscribe = addUserChangeListener((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setShowMigrationModal(false);
        setMigrationComplete(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Check for legacy chats when user ID changes
  useEffect(() => {
    if (!userId) return;
    
    const checkMigration = async () => {
      try {
        const hasLegacyChats = await checkForLegacyChats(userId);
        if (hasLegacyChats) {
          setShowMigrationModal(true);
        }
      } catch (err) {
        console.error('Error checking for migration:', err);
      }
    };
    
    checkMigration();
  }, [userId]);

  // Handle migration process
  const handleMigrate = async () => {
    if (!userId) return;
    
    setIsMigrating(true);
    setError(null);
    
    try {
      await migrateLegacyChats(userId);
      setMigrationComplete(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowMigrationModal(false);
      }, 3000);
    } catch (err) {
      setError('Failed to migrate chats. Please try again later.');
      console.error('Migration error:', err);
    } finally {
      setIsMigrating(false);
    }
  };

  // Handle skipping migration
  const handleSkip = () => {
    setShowMigrationModal(false);
  };

  if (!showMigrationModal) {
    return null;
  }

  return (
    <div className="migration-modal-backdrop">
      <div className="migration-modal">
        <h2>Chat Migration</h2>
        
        {!migrationComplete ? (
          <>
            <p>We've detected chats from an older version of the application.</p>
            <p>Would you like to migrate these chats to the new system?</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="migration-actions">
              <button 
                onClick={handleMigrate} 
                disabled={isMigrating}
                className="primary-button"
              >
                {isMigrating ? 'Migrating...' : 'Migrate Chats'}
              </button>
              <button 
                onClick={handleSkip}
                disabled={isMigrating}
                className="secondary-button"
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <div className="migration-success">
            <p>Migration complete! Your chats have been successfully migrated.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMigration; 