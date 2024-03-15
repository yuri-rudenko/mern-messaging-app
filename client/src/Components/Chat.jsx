import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '..';
import '../Pages/styles/chat.css'
import { observer } from 'mobx-react-lite';
import Message from './Message';
import { sendMessage } from '../http/messageAPI';
import io from 'socket.io-client';
import { useAsyncError } from 'react-router-dom';
import { Uploader } from 'rsuite';
import AttachmentIcon from '@rsuite/icons/Attachment';

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

    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false);
    const [notUpload, setNotUpload] = useState([]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const resetInputValue = () => {
        setInputValue("");
    };

    // Socket connection
    useEffect(() => {
        socket.emit("setup", user.user);
        socket.on('connection', () => {
            setSocketConnected(true);
        })
    }, []);


    // Loading of a chat
    useEffect(() => {
        setLoading(true);
        resetInputValue();
        if (chatContext.activeChat.users) {
            setTimeout(() => {
                scrollToBottom();
                setLoading(false);
                
            }, 10)
        }
        socket.emit('join chat', chatContext.activeChat);
    }, [chatContext.activeChat]);


    // Socket.io live message addition
    useEffect(() => {

        const handleMessageReceived = (newMessageRecieved) => {

            if(!chatContext.activeChat._id || chatContext.activeChat._id !== newMessageRecieved.chat._id) {
                // Error
            }
            else {
                chatContext.appendMessage(newMessageRecieved.message);

                setTimeout(() => {
                    scrollToBottom();
                }, 10)
            }

            chatContext.setLatestMessage(newMessageRecieved.message);
            chatContext.sortChats();
        }

        socket.on("message recieved", handleMessageReceived);

        return () => {
            socket.removeAllListeners("message recieved");
        };
        
    }, []);


    // Sending message event
    useEffect(() => {

        const handleKeyDown = async (key) => {

            const messageValue = inputValue;

            if(inputValue.trim() !== "" && key.key ==="Enter") {
                resetInputValue();
                const {message} = await sendMessage({
                    content: {
                        type: 'Text',
                        text: messageValue,
                    },
                    id: user.user._id,
                    chatId: chatContext.activeChat._id
                })
                socket.emit("new message", {message, chat: chatContext.activeChat, sender: user.user})
                if(message) {
                    chatContext.appendMessage(message);
                    chatContext.setLatestMessage(message);
                    chatContext.sortChats();
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

            {loading && socketConnected && chatContext.activeChat.users && <div/>}

            {chatContext.activeChat.users ? <div className={loading? "main-chat hidden": "main-chat"}>
                {chatContext.activeChat.messages[0] 
                ? (
                    <div className="messages">
                        <div className='messages-container'>
                            {chatContext.activeChat.messages.map(message =>
                                <Message user={user.user} message={message} key={message._id}></Message>
                            )}
                        </div>
                        <div className="chat-bottom">
                            <Uploader 
                            multiple 
                            className='uploader'
                            listType="picture" 
                            onChange={() => setNotUpload([])} 
                            fileList={notUpload}
                            
                            action={process.env.REACT_APP_API_URL + '/api/files/uploadImage'}
                            >
                                <button style={{height:"50px", width:"50px", borderRadius:"10px 0px 0px 10px"}}>
                                    <AttachmentIcon height={"20px"} width={"20px"}/>
                                </button>
                            </Uploader>
                            <input value={inputValue} onChange={handleInputChange} ref={inputRef} autoFocus className='write-message' placeholder='Write a message...'></input>
                        </div>
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