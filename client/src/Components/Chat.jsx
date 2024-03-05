import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import '../Pages/styles/chat.css'
import { observer } from 'mobx-react-lite';
import Message from './Message';

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
            {activeChat.messages[0] 
            ? (
                <div className="messages">
                    {activeChat.messages.map(message =>
                        <Message user={user.user} message={message} key={message._id}></Message>
                    )}
                </div>
            ) 
            : (
                <p>Write your first message!</p>
            )}
            </div>
            
            : <p>Choose your chat</p>}
        </div>
    );
})

export default Chat;
