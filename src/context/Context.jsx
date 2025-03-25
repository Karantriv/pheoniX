import { createContext, useState, useEffect } from "react";
import runChat, { runMultiModal, resetChat } from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [userName, setUserName] = useState("User");
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChat, setCurrentChat] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Load theme preference from localStorage on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkTheme(savedTheme === 'dark');
        }
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

    const toggleTheme = () => {
        setIsDarkTheme(prev => !prev);
    };

    const delayPara = (index, nextWord) => {
        setTimeout(function() {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setCurrentChat([]);
        setSelectedImage(null);
        resetChat();
    };

    const handleImageUpload = (file) => {
        if (file) {
            setSelectedImage(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    const onSent = async(prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        
        let userPrompt = prompt;
        if (prompt === undefined) {
            userPrompt = input;
            setPrevPrompts(prev => [...prev, input]);
        } else {
            setPrevPrompts(prev => [...prev, prompt]);
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
            
            if (selectedImage) {
                // Use multimodal API for image processing
                response = await runMultiModal(userPrompt, selectedImage);
                setSelectedImage(null); // Clear image after sending
            } else {
                // Use text-only API
                response = await runChat(userPrompt, updatedChat);
            }
            
            // Add the AI response to current chat
            setCurrentChat(prev => [...prev, { role: 'model', content: response }]);
            
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
        userName,
        setUserName,
        currentChat,
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