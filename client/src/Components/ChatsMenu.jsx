import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { getChat } from '../http/chatAPI.js';

const ChatsMenu = observer(() => {
    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (user.user.chats) {
            setChats(user.user.chats);
            console.log(user.user.chats[0], 123);
        }
    }, [user.user]);

    const setActiveChat = async (chatID) => {
        const result = await getChat(chatID);
        if(result.chat) chatContext.setActiveChat(result.chat);
    }

    return (
        <div className='chats-menu'>
            {chats && chats.map(chat => (
                
                <div onClick={() => setActiveChat(chat._id)} className={chatContext.activeChat._id === chat._id ? "left-chat active-chat" : "left-chat"} key={chat._id}>
                    <div className="left">
                        <img className='chat-picture' src={chat.displayPicture} alt="" />
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
