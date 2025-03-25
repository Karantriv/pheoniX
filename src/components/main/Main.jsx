import React, { useContext, useRef, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../firebase/AuthContext';

const Main = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { 
    onSent, 
    recentPrompt, 
    showResult, 
    loading, 
    resultData, 
    setInput, 
    input,
    userName,
    currentChat,
    newChat,
    handleImageUpload,
    selectedImage,
    removeImage,
    isDarkTheme,
    toggleTheme
  } = useContext(Context);

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
    } else {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
    }
    // Clear the input so the same file can be selected again
    e.target.value = '';
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
      <div className="nav">
        <p>Gemini</p>
        <div className="nav-right">
          <div className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? (
              <span className="theme-icon">🌞</span>
            ) : (
              <span className="theme-icon">🌙</span>
            )}
          </div>
          <img src={assets.user_icon} alt="" />
        </div>
      </div>
      <div className="main-container">

        {!showResult 
        ?<>
        <div className="greet">
          <p><span>Hello, {userName}.</span></p>
          <p>How can I help you today?</p>
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
              <img src={message.role === 'user' ? assets.user_icon : assets.gemini_icon} alt="" />
              <div className="message-content">
                {message.role === 'user' ? (
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
                ) : (
                  index === currentChat.length - 1 && loading ? (
                    <div className='loader'>
                      <hr />
                      <hr />
                      <hr />
                    </div>
                  ) : (
                    <p dangerouslySetInnerHTML={{__html: index === currentChat.length - 1 ? resultData : message.content}}></p>
                  )
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
                    accept="image/*"
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
            Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main;