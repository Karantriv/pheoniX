import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveChat, getUserChats, cleanupOldChats, deleteAllUserChats } from './ChatService';

/**
 * This component is for testing the chat service functionality.
 * It allows you to:
 * 1. Save a test chat to Firebase
 * 2. Load chats from Firebase
 * 3. Clean up old chats (keep only the last 5)
 * 4. Delete all chats for the current user
 */
const ChatServiceTester = () => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load chats when the component mounts
  useEffect(() => {
    if (currentUser) {
      loadChats();
    }
  }, [currentUser]);

  // Create a test chat
  const createTestChat = async () => {
    if (!currentUser) {
      setMessage('You must be logged in to create a chat');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const chatId = Date.now().toString();
      const newChat = {
        id: chatId,
        title: `Test Chat ${new Date().toLocaleTimeString()}`,
        messages: [
          { role: 'user', content: 'This is a test message' },
          { role: 'model', content: 'This is a test response' }
        ]
      };

      await saveChat(currentUser.uid, newChat);
      setMessage(`Chat saved successfully with ID: ${chatId}`);
      
      // Reload chats
      await loadChats();
    } catch (error) {
      console.error('Error creating test chat:', error);
      setMessage(`Error creating test chat: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load chats from Firebase
  const loadChats = async () => {
    if (!currentUser) {
      setMessage('You must be logged in to load chats');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const userChats = await getUserChats(currentUser.uid);
      setChats(userChats);
      setMessage(`Loaded ${userChats.length} chats`);
    } catch (error) {
      console.error('Error loading chats:', error);
      setMessage(`Error loading chats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clean up old chats (keep only the last 5)
  const cleanupChats = async () => {
    if (!currentUser) {
      setMessage('You must be logged in to clean up chats');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await cleanupOldChats(currentUser.uid);
      setMessage('Cleaned up old chats');
      
      // Reload chats
      await loadChats();
    } catch (error) {
      console.error('Error cleaning up chats:', error);
      setMessage(`Error cleaning up chats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete all chats for the current user
  const deleteChats = async () => {
    if (!currentUser) {
      setMessage('You must be logged in to delete chats');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await deleteAllUserChats(currentUser.uid);
      setMessage('Deleted all chats');
      
      // Reload chats
      await loadChats();
    } catch (error) {
      console.error('Error deleting chats:', error);
      setMessage(`Error deleting chats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Chat Service Tester</h2>
      
      {currentUser ? (
        <p>Logged in as: {currentUser.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={createTestChat} 
          disabled={loading || !currentUser}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Create Test Chat
        </button>
        
        <button 
          onClick={loadChats} 
          disabled={loading || !currentUser}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Load Chats
        </button>
        
        <button 
          onClick={cleanupChats} 
          disabled={loading || !currentUser}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Cleanup Old Chats
        </button>
        
        <button 
          onClick={deleteChats} 
          disabled={loading || !currentUser}
          style={{ padding: '8px 16px', backgroundColor: '#ff4d4d', color: 'white', border: 'none' }}
        >
          Delete All Chats
        </button>
      </div>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}
      
      <h3>Chats ({chats.length})</h3>
      
      {loading ? (
        <p>Loading...</p>
      ) : chats.length > 0 ? (
        <div>
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '10px',
                marginBottom: '10px'
              }}
            >
              <h4>{chat.title}</h4>
              <p>ID: {chat.id}</p>
              <p>Created: {new Date(chat.timestamp).toLocaleString()}</p>
              <p>Messages: {chat.messages.length}</p>
              <details>
                <summary>View Messages</summary>
                <div style={{ marginTop: '10px' }}>
                  {chat.messages.map((msg, index) => (
                    <div 
                      key={index}
                      style={{ 
                        padding: '8px', 
                        backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f1f8e9',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}
                    >
                      <strong>{msg.role}:</strong> {msg.content}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      ) : (
        <p>No chats found</p>
      )}
    </div>
  );
};

export default ChatServiceTester;
