import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '..';
import '../Pages/styles/chat.css'
import { observer } from 'mobx-react-lite';
import Message from './Message';
import { sendMessage } from '../http/messageAPI';
import io from 'socket.io-client';
import { useAsyncError } from 'react-router-dom';

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

let socket, selectedChatCompare;
socket = io(process.env.REACT_APP_API_URL);

const Chat = observer(() => {

    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;

    const inputRef = useRef();

    const [activeChat, setActiveChat] = useState({});
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const resetInputValue = () => {
        setInputValue("");
    };

    useEffect(() => {
        socket.emit("setup", user.user);
        socket.on('connection', () => {
            setSocketConnected(true);
        })
    }, []);

    useEffect(() => {
        setLoading(true);
        resetInputValue();
        if (chatContext.activeChat.users) {
            setActiveChat();
            setTimeout(() => {
                scrollToBottom();
                setLoading(false);
                
            }, 10)
        }
        socket.emit('join chat', chatContext.activeChat);
    }, [chatContext.activeChat]);

    useEffect(() => {

        console.log("added effect");

        socket.on("message recieved", (newMessageRecieved) => {
            console.log(chatContext.activeChat._id, newMessageRecieved.chat._id)
            if(!chatContext.activeChat._id || chatContext.activeChat._id !== newMessageRecieved.chat._id) {
                
            }
            else {
                chatContext.appendMessage(newMessageRecieved.message);
                setTimeout(() => {
                    scrollToBottom();
                }, 10)
            }
        });

        scrollToBottom();
        
    }, []);

    useEffect(() => {

        const handleKeyDown = async (key) => {

            if(inputValue.trim() !== "" && key.key ==="Enter") {
                const {message} = await sendMessage({
                    content: {
                        type: 'Text',
                        text: inputValue,
                    },
                    id: user.user._id,
                    chatId: chatContext.activeChat._id
                })
                socket.emit("new message", {message, chat: chatContext.activeChat, sender: user.user})
                if(message) {
                    chatContext.appendMessage(message);
                    resetInputValue();
                    setTimeout(() => {
                        scrollToBottom();
                    }, 10)
                }
            }
            if(inputRef.current && chatContext.messageAutoFocus) {
                inputRef.current.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    return (
        <div className='chat'>

            {loading && chatContext.activeChat.users && <div/>}

            {chatContext.activeChat.users ? <div className={loading? "main-chat hidden": "main-chat"}>
                {chatContext.activeChat.messages[0] 
                ? (
                    <div className="messages">
                        <div className='messages-container'>
                            {chatContext.activeChat.messages.map(message =>
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