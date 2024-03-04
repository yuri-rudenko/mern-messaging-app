import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import '../Pages/styles/chat.css'
import { observer } from 'mobx-react-lite';

const Chat = observer(() => {

        const { user } = useContext(Context);
        const chatContext = useContext(Context).chat;

        const [activeChat, setActiveChat] = useState({});

        useEffect(() => {
            if (chatContext.activeChat.users) {
                setActiveChat(chatContext.activeChat);
            }
        }, [chatContext.activeChat]);

    return (
        <div className='chat'>
            {activeChat.users ? 
            
            <div className="main-chat">
                {activeChat.messages[0] ? activeChat.messages.map(message => 
                <p key={message._id} className='message'>{message.text}</p>)
                : <p>Write your first message!</p>
                }
            </div>
            
            : <p>Choose your chat</p>}
        </div>
    );
})

export default Chat;
