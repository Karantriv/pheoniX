import React, { useContext, useState } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { Context } from '../../context/Context'
import { useAuth } from '../../firebase/AuthContext'

const Sidebar = () => {
    const [extended,setExtended] = useState(false)
    const {onSent, prevPrompts, setRecentPrompt, newChat, chatHistory, loadChat, activeChat} = useContext(Context)
    const { logout } = useAuth()
     
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

    return (
        <div className = 'sidebar'>
            <div className="top">
                <img onClick={()=>setExtended(prev=>!prev) }src= {assets.menu_icon} alt="" className="menu" />
                <div onClick={()=>newChat()}className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended?<p>New Chat</p>:null}
                </div>
                {extended && (
                    <>
                        {chatHistory.length > 0 && (
                            <div className="recent">
                                <p className="recent-title">Chat History</p>
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
                        )}
                    </>
                )}     
            </div> 
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended?<p>Help</p>:null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended?<p>Activity</p>:null}
                </div>
                <div className="bottom-item recent-entry">
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