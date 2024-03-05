import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import '../Pages/styles/chat.css'
import { observer } from 'mobx-react-lite';
import Message from './Message';

function scrollToBottom() {
    let messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    else {
        setTimeout(scrollToBottom, 10);
    }
}

const Chat = observer(() => {

    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;

    const [activeChat, setActiveChat] = useState({});

    useEffect(() => {
        if (chatContext.activeChat.users) {
            setActiveChat(chatContext.activeChat);
            scrollToBottom();
        }
    }, [chatContext.activeChat]);

    return (
        <div className='chat'>
            {activeChat.users ? 

            <div className="main-chat">
            {activeChat.messages[0] 
            ? (
                <div className="messages">
                    <div className='messages-container'>
                        {activeChat.messages.map(message =>
                            <Message user={user.user} message={message} key={message._id}></Message>
                        )}
                    </div>
                    <input className='write-message' placeholder='Write a message...'></input>
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
