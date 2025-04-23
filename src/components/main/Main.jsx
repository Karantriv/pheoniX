import React, { useContext, useRef, useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../firebase/AuthContext';
import PhoenixWings from './PhoenixWings';
import phoenixLogo from '../../assets/gemini_icon.png';

const Main = () => {
  const navigate = useNavigate();
  const { currentUser, logout, userProfilePic: authProfilePic } = useAuth();
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [logoSpinning, setLogoSpinning] = useState(false);
  const [showWingsFlash, setShowWingsFlash] = useState(false);
  
  const { 
    onSent, 
    recentPrompt, 
    showResult, 
    loading, 
    resultData, 
    setInput, 
    input,
    userName,
    getUserInitials,
    userProfilePic: contextProfilePic,
    currentChat,
    newChat,
    handleImageUpload,
    selectedImage,
    removeImage,
    isDarkTheme,
    toggleTheme
  } = useContext(Context);

  // Combine profile pic from both sources, prioritizing auth
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // Use auth profile pic first, fall back to context profile pic
    if (authProfilePic) {
      setProfilePic(authProfilePic);
    } else if (contextProfilePic) {
      setProfilePic(contextProfilePic);
    } else {
      setProfilePic(null);
    }
  }, [authProfilePic, contextProfilePic]);

  const handleLogoClick = () => {
    if (logoSpinning) return; // Prevent multiple clicks
    
    setLogoSpinning(true);
    
    // After logo spinning completes, show wings flash
    setTimeout(() => {
      setShowWingsFlash(true);
      
      // After wings animation completes, redirect to new chat
      setTimeout(() => {
        newChat();
        setLogoSpinning(false);
        setShowWingsFlash(false);
      }, 800);
    }, 800);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleCardClick = (text) => {
    setInput(text);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
      handleImageUpload(file);
    } else if (file) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
    }
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const submitVoiceInput = (voiceText) => {
    if (voiceText && voiceText.trim()) {
      console.log("Submitting voice command:", voiceText);
      onSent(voiceText);
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser doesn't support speech recognition. Try Chrome or Edge.");
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let finalTranscript = '';

    recognition.onstart = () => {
      console.log('Voice recognition activated');
      finalTranscript = '';
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = transcript; // Store only the most recent final result
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Use final transcript if available, otherwise use interim
      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      setInput(currentTranscript); // Update input field with speech
      
      console.log("Speech recognized:", currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      
      // Use the dedicated function to submit the voice input
      submitVoiceInput(transcript);
    };

    // Add a timeout to automatically stop listening after 5 seconds
    // This prevents the API from running too long if user doesn't speak
    const timeout = setTimeout(() => {
      if (recognition) {
        recognition.stop();
      }
    }, 5000);

    recognition.start();

    // Store recognition instance and timeout to clean up later
    window.recognitionInstance = recognition;
    window.recognitionTimeout = timeout;
  };

  const stopListening = () => {
    if (window.recognitionInstance) {
      window.recognitionInstance.stop();
    }
    if (window.recognitionTimeout) {
      clearTimeout(window.recognitionTimeout);
    }
    setIsListening(false);
  };

  return (
    <div className='main'>
      <PhoenixWings />
      {showWingsFlash && <div 
        className="logo-wings-flash active"
      ></div>}
      <div className="nav">
        <div className="logo-container" onClick={handleLogoClick}>
          <img 
            src={phoenixLogo} 
            alt="Phoenix Logo" 
            className={`nav-logo ${logoSpinning ? 'spinning' : ''}`} 
          />
          <p>phoeniX</p>
        </div>
        <div className="nav-right">
          <div className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? (
              <span className="theme-icon">🌞</span>
            ) : (
              <span className="theme-icon">🌙</span>
            )}
          </div>
          {profilePic ? (
            <div className="user-profile" onClick={handleProfileClick}>
              <img 
                src={profilePic} 
                alt={userName} 
                className="user-profile-pic" 
                title={userName} 
              />
            </div>
          ) : (
            <div className="user-initials" onClick={handleProfileClick} title={userName}>
              {getUserInitials()}
            </div>
          )}
        </div>
      </div>
      <div className="main-container">

        {!showResult 
        ?<>
        <div className="greet">
          <p><span>Relive, {userName}.</span></p>
          <p>Your AI Ally</p>
        </div>
        <div className="cards">
        <div className="card" onClick={() => handleCardClick("Suggest beautiful places to see on an upcoming road trip")}>
          <p>Suggest beautiful places to see on an upcoming road trip</p>
          <img src={assets.compass_icon} alt="" />
        </div>
        <div className="card" onClick={() => handleCardClick("Briefly summarize this concept: urban planning")}>
          <p>Briefly summarize this concept: urban planning</p>
          <img src={assets.bulb_icon} alt="" />
        </div>
        <div className="card" onClick={() => handleCardClick("Brainstorm team bonding activities for our work retreat")}>
          <p>Brainstorm team bonding activities for our work retreat</p>
          <img src={assets.message_icon} alt="" />
        </div>
        <div className="card" onClick={() => handleCardClick("Improve the readability of the following code")}>
          <p>Improve the readability of the following code</p>
          <img src={assets.code_icon} alt="" />
        </div>
        </div>


        </>
        : <div className='result'>
          {currentChat.map((message, index) => (
            <div key={index} className={message.role === 'user' ? "result-title" : "result-data"}>
              {message.role === 'model' ? (
                <img src={assets.gemini_icon} alt="Phoenix" />
              ) : (
                profilePic ? (
                  <img src={profilePic} alt={userName} className="user-profile-pic" />
                ) : (
                  <div className="user-initials">{getUserInitials()}</div>
                )
              )}
              <div className="message-content">
                {message.role === 'model' ? (
                  index === currentChat.length - 1 && loading ? (
                    <div className='loader'>
                      <hr />
                      <hr />
                      <hr />
                    </div>
                  ) : (
                    <p dangerouslySetInnerHTML={{__html: index === currentChat.length - 1 ? resultData : message.content}}></p>
                  )
                ) : (
                  <>
                    <p>{message.content}</p>
                    {message.hasImage && message.imageUrl && (
                      <div className="uploaded-image-container">
                        <img 
                          src={message.imageUrl} 
                          alt="Uploaded" 
                          className="uploaded-image" 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        }

        
        <div className="main-bottom">
          <div className={`search-box ${isListening ? 'listening-active' : ''}`}>
            <input 
              onChange={(e) => setInput(e.target.value)}
              value={input} 
              type="text" 
              placeholder={isListening ? 'Listening...' : 'Enter a prompt here'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (input || selectedImage)) {
                  onSent();
                }
              }}
            />
            <div>
              {selectedImage ? (
                <div className="image-preview-container">
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(selectedImage)} 
                      alt="Selected" 
                      className="preview-thumbnail" 
                    />
                    <button 
                      className="remove-image-btn"
                      onClick={removeImage}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                  />
                  <img 
                    src={assets.gallery_icon} 
                    alt="Upload" 
                    onClick={handleFileSelect}
                    style={{ cursor: 'pointer' }}
                  />
                </>
              )}
              <div 
                className={`mic-container ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
              >
                <img src={assets.mic_icon} alt="Voice" />
              </div>
              {(input || selectedImage) ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
            </div>
          </div>
          <p className="bottom-info">
          Phoenix is powerful, but accuracy isn't guaranteed—double-check responses!        <br/> by~ Karan Trivedi</p>
        </div>
      </div>
    </div>
  )
}

export default Main;