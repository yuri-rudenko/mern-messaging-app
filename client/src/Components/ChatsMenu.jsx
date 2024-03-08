import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { getChat } from '../http/chatAPI.js';

const ChatsMenu = observer(() => {
    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;
    const [chats, setChats] = useState([]);
    const [clickable, setClickable] = useState(true);

    useEffect(() => {
        if (user.user.chats) {
            setChats(user.user.chats);
        }
    }, [user.user]);

    const setActiveChat = async (chatID) => {
        if(clickable && chatContext.activeChat._id !== chatID) {
            setClickable(false);
            const result = await getChat(chatID);
            if(result.chat) chatContext.setActiveChat(result.chat);
            setClickable(true);
        }
    }

    const filterChats = (value) => {
        if(!value) {
            setChats(user.user.chats);
            return;
        }
        setChats(chats.filter(chat => chat.name.toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <div className='chats-menu'>
            <input className='search-chats' placeholder='Search' onChange={(e) => filterChats(e.target.value)} onFocus={() => chatContext.setMessageAutoFocus(false)} onBlur={() => chatContext.setMessageAutoFocus(true)}></input>
            {chats && chats.map(chat => (
                
                <div onClick={() => setActiveChat(chat._id)} className={chatContext.activeChat._id === chat._id ? "left-chat active-chat" : "left-chat"} key={chat._id}>
                    <div className="left">
                        <img className='chat-picture' src={chat.displayPicture} alt="CHAT"/>
                    </div>

                    <div className="right">
                        <div className="top">
                            <p className='chat-name'>{chat.name}</p>
                            {chat.latestMessage ? <p className='time'>{new Date(chat.latestMessage.createdAt).getHours()}:{new Date(chat.latestMessage.createdAt).getMinutes()}</p> : <></>}
                        </div>
                        {chat.latestMessage ? <div className="bottom">
                            <p className='author'>{chat.latestMessage.author.name.split(" ")[0]}: </p> 
                            <p className='text'>{chat.latestMessage.text}</p>
                        </div> 
                        : <p className='bottom'>No messages</p> }
                    </div>

                </div>
            ))}
        </div>
    );
});

export default ChatsMenu;
