import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '..';
import '../Pages/styles/chat.css'
import { observer } from 'mobx-react-lite';
import Message from './Message';
import { sendMessage } from '../http/messageAPI';
import Loader from './small/Loader';

let scrollIterations = 0;

function scrollToBottom() {
    let messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
        if (scrollIterations < 10) {
            setTimeout(scrollToBottom, 10);
            scrollIterations++;
        }
    }
}

const Chat = observer(() => {

    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;

    const inputRef = useRef();

    const [activeChat, setActiveChat] = useState({});
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const resetInputValue = () => {
        setInputValue("");
    };

    useEffect(() => {
        setLoading(true);
        resetInputValue();
        if (chatContext.activeChat.users) {
            setActiveChat(chatContext.activeChat);
            setTimeout(() => {
                scrollToBottom();
                setLoading(false);
                
            }, 10)
        }
        console.log(loading);
    }, [chatContext.activeChat]);

    useEffect(() => {

        const handleKeyDown = async (key) => {

            if(inputValue.trim() !== "" && key.key ==="Enter") {
                const {message} = await sendMessage({
                    content: {
                        type: 'Text',
                        text: inputValue,
                    },
                    id: user.user._id,
                    chatId: activeChat._id
                })
                if(message) {
                    chatContext.appendMessage(message);
                    resetInputValue();
                    setTimeout(() => {
                        scrollToBottom();
                    }, 10)
                }
            }
            if(inputRef.current) inputRef.current.focus();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            
            document.removeEventListener('keydown', handleKeyDown);
        };
    })

    return (
        <div className='chat'>

            {loading && activeChat.users && <div/>}

            {activeChat.users ? 

            <div className={loading? "main-chat hidden": "main-chat"}>
                {activeChat.messages[0] 
                ? (
                    <div className="messages">
                        <div className='messages-container'>
                            {activeChat.messages.map(message =>
                                <Message user={user.user} message={message} key={message._id}></Message>
                            )}
                        </div>
                        <input value={inputValue} onChange={handleInputChange} ref={inputRef} autoFocus className='write-message' placeholder='Write a message...'></input>
                    </div>
                ) 
                : (
                    <div className="messages">
                    <p>Write your first message!</p>
                    <input value={inputValue} onChange={handleInputChange} ref={inputRef} autoFocus className='write-message' placeholder='Write a message...'></input>
                    </div>
                )}
                </div>
            
            : <p>Choose your chat</p>}
            
        </div>
    );
})

export default Chat;
