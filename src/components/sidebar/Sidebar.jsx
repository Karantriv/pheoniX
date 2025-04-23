import React, { useContext, useState } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { Context } from '../../context/Context'
import { useAuth } from '../../firebase/AuthContext'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const navigate = useNavigate()
    const [extended,setExtended] = useState(false)
    const {
        onSent, 
        prevPrompts, 
        setRecentPrompt, 
        newChat, 
        chatHistory, 
        loadChat, 
        activeChat, 
        setInput,
        isLoadingChats
    } = useContext(Context)
    const { logout, currentUser } = useAuth()
     
    const loadPrompt = async(prompt) =>{
        setRecentPrompt(prompt)
        await onSent(prompt)
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    }

    const handleHelp = () => {
        newChat()
        setInput("What can Phoenix do for me? Show me some examples and features.")
    }

    const handleActivity = () => {
        // If there's no active chat but there's chat history, load the most recent chat
        if (!activeChat && chatHistory.length > 0) {
            loadChat(chatHistory[0].id)
        }
        // Otherwise if there's no chat history, create a new chat with the activity summary prompt
        else if (chatHistory.length === 0) {
            newChat()
            setInput("Show me a summary of what we can do together.")
        }
    }

    const handleSettings = () => {
        navigate('/profile')
    }

    return (
        <div className={`sidebar ${extended ? '' : 'collapsed'}`}>
            <div className="top">
                <img onClick={()=>setExtended(prev=>!prev) }src= {assets.menu_icon} alt="" className="menu" />
                <div onClick={()=>newChat()}className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended?<p>New Chat</p>:null}
                </div>
                {extended && (
                    <>
                        {isLoadingChats ? (
                            <div className="recent">
                                <p className="recent-title">Loading chats...</p>
                                <div className="chat-loader">
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                    <div className="loader-dot"></div>
                                </div>
                            </div>
                        ) : chatHistory.length > 0 ? (
                            <div className="recent">
                                <p className="recent-title">Chat History (Last 5)</p>
                                {chatHistory.map((chat) => (
                                    <div 
                                        key={chat.id} 
                                        onClick={() => loadChat(chat.id)} 
                                        className={`recent-entry ${activeChat === chat.id ? 'active-chat' : ''}`}
                                    >
                                        <img src={assets.message_icon} alt="" />
                                        <p>{chat.title.slice(0, 18)}...</p>
                                    </div>
                                ))}
                            </div>
                        ) : currentUser ? (
                            <div className="recent">
                                <p className="recent-title">No chat history</p>
                                <p className="no-chats-message">Start a new chat to see it here</p>
                            </div>
                        ) : null}
                    </>
                )}     
            </div> 
            <div className="bottom">
                <div className="bottom-item recent-entry" onClick={handleHelp}>
                    <img src={assets.question_icon} alt="" />
                    {extended?<p>Help</p>:null}
                </div>
                <div className="bottom-item recent-entry" onClick={handleActivity}>
                    <img src={assets.history_icon} alt="" />
                    {extended?<p>Activity</p>:null}
                </div>
                <div className="bottom-item recent-entry" onClick={handleSettings}>
                    <img src={assets.setting_icon} alt="" />
                    {extended?<p>Settings</p>:null}
                </div>
                <div className="bottom-item recent-entry" onClick={handleLogout}>
                    <span className="logout-icon">↪</span>
                    {extended?<p>Sign Out</p>:null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
