import { createContext, useState, useEffect, useCallback } from "react";
import runChat, { runMultiModal, resetChat } from "../config/gemini";
import { getCustomResponse } from "../config/customResponses";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [userName, setUserName] = useState("User");
    const [userProfilePic, setUserProfilePic] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChat, setCurrentChat] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Get user initials from their name - memoized for performance
    const getUserInitials = useCallback(() => {
        if (!userName || userName === "User") return "U";
        
        const names = userName.trim().split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        } else {
            return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
        }
    }, [userName]);

    // Load saved preferences from localStorage only once on initial load
    useEffect(() => {
        const loadPreferences = () => {
            // Load theme preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setIsDarkTheme(savedTheme === 'dark');
            }
            
            // Load user name
            const savedUserName = localStorage.getItem('userName');
            if (savedUserName) {
                setUserName(savedUserName);
            }

            // Load user profile pic
            const savedProfilePic = localStorage.getItem('userProfilePic');
            if (savedProfilePic) {
                setUserProfilePic(savedProfilePic);
            }
        };

        loadPreferences();
    }, []);

    // Apply theme whenever isDarkTheme changes
    useEffect(() => {
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        // Save theme preference
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }, [isDarkTheme]);

    const toggleTheme = useCallback(() => {
        setIsDarkTheme(prev => !prev);
    }, []);

    const delayPara = useCallback((index, nextWord) => {
        setTimeout(function() {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }, []);

    const newChat = useCallback(() => {
        setLoading(false);
        setShowResult(false);
        
        // Create a new chat entry if there are messages in the current chat
        if (currentChat.length > 0) {
            // Add the current chat to chat history if it's not empty
            const chatId = Date.now().toString();
            setChatHistory(prev => [
                ...prev, 
                {
                    id: chatId,
                    title: currentChat[0]?.content?.slice(0, 30) || "New Chat",
                    messages: [...currentChat]
                }
            ]);
            
            // Update the active chat to the newly created one
            setActiveChat(chatId);
        }
        
        // Reset the current chat for the new conversation
        setCurrentChat([]);
        setSelectedImage(null);
        resetChat();
    }, [currentChat]);

    // Load a chat from history
    const loadChat = useCallback((chatId) => {
        const chat = chatHistory.find(chat => chat.id === chatId);
        if (chat) {
            setCurrentChat(chat.messages);
            setActiveChat(chatId);
            setShowResult(true);
        }
    }, [chatHistory]);

    const handleImageUpload = useCallback((file) => {
        if (file) {
            setSelectedImage(file);
        }
    }, []);

    const removeImage = useCallback(() => {
        setSelectedImage(null);
    }, []);

    const updateUserProfilePic = useCallback((url) => {
        setUserProfilePic(url);
        // Also save to localStorage for persistence
        if (url) {
            localStorage.setItem('userProfilePic', url);
        } else {
            localStorage.removeItem('userProfilePic');
        }
    }, []);

    const onSent = async(prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        let userPrompt = prompt;
        if (prompt === undefined) {
            userPrompt = input;
            
            // Store the prompt in prevPrompts only if it's a new chat or the first message
            if (currentChat.length === 0) {
                setPrevPrompts(prev => [...prev, input]);
            }
        } else {
            // Store the prompt in prevPrompts only if it's a new chat or the first message
            if (currentChat.length === 0) {
                setPrevPrompts(prev => [...prev, prompt]);
            }
        }
        
        // Skip empty prompts
        if (!userPrompt.trim()) {
            setLoading(false);
            return;
        }
        
        console.log("Sending prompt to AI:", userPrompt);
        
        setRecentPrompt(userPrompt);
        
        // Create user message content
        let userContent = userPrompt;
        
        // Add the user message to current chat
        const updatedChat = [...currentChat, { 
            role: 'user', 
            content: userContent,
            hasImage: !!selectedImage,
            imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : null
        }];
        setCurrentChat(updatedChat);
        
        try {
            let response;
            
            // Check for custom responses first if there's no image
            const customResponse = !selectedImage ? getCustomResponse(userPrompt, { userName }) : null;
            
            if (customResponse) {
                // Use custom response
                response = customResponse;
                console.log("Using custom response:", response);
            } else if (selectedImage) {
                // Use multimodal API for image processing
                response = await runMultiModal(userPrompt, selectedImage);
                setSelectedImage(null); // Clear image after sending
            } else {
                // Use text-only API
                response = await runChat(userPrompt, updatedChat);
            }
            
            // Add the AI response to current chat
            const updatedChatWithResponse = [...updatedChat, { role: 'model', content: response }];
            setCurrentChat(updatedChatWithResponse);
            
            // Format the response
            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            
            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
        } catch (error) {
            console.error("Error in chat:", error);
            setResultData("Sorry, there was an error processing your request. Please try again.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        loadChat,
        userName,
        setUserName,
        getUserInitials,
        userProfilePic,
        updateUserProfilePic,
        currentChat,
        chatHistory,
        activeChat,
        handleImageUpload,
        selectedImage,
        removeImage,
        isDarkTheme,
        toggleTheme
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;