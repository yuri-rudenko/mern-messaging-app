import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '..';
import '../Pages/styles/chat.css'
import '../Pages/styles/chat-header.css'
import { observer } from 'mobx-react-lite';
import Message from './Message';
import { sendMessage } from '../http/messageAPI';
import io from 'socket.io-client';
import { Uploader } from 'rsuite';
import AttachmentIcon from '@rsuite/icons/Attachment';
import MoreIcon from '@rsuite/icons/More';
import ChatSettingsModal from './small/ChatSettings/ChatSettingsModal';
import AddUsersToChatModal from './small/ChatSettings/AddUsersToChatModal';
import ChatBottom from './small/ChatBottom/ChatBottom';

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

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

        <ChatSettingsModal open={open} setOpen={setOpen}/>
        <AddUsersToChatModal setOpenFirst={setOpen}/>

            {loading && socketConnected && chatContext.activeChat.users && <div/>}
            
            {chatContext.activeChat.createdAt && 
            <div className="chat-header">
                <div className="chat-header-left">
                    <div className="pfp">
                        <img src={process.env.REACT_APP_API_URL + '/' + chatContext.activeChat.displayPicture} alt="Chat image"/>
                    </div>
                    <div className="text">
                        <p className="name">{chatContext.activeChat.name}</p>
                        <p className='online'>Online 7m ago</p>
                    </div>
                </div>
                <div className="chat-header-right">
                    <MoreIcon height="40px" width="40px" onClick={handleOpen}/>
                </div>
            </div>
            }

            {chatContext.activeChat.users ? <div className={loading? "main-chat hidden": "main-chat"}>
                {chatContext.activeChat.messages[0] 
                ? (
                    <div className="messages">
                        <div className='messages-container'>
                            {chatContext.activeChat.messages.map(message =>
                                <Message user={user.user} message={message} key={message._id}></Message>
                            )}
                        </div>
                        <ChatBottom inputValue={inputValue} handleInputChange={handleInputChange} inputRef={inputRef}/>
                    </div>
                ) 
                : (
                    <div className="messages">

                        <p>Write your first message!</p>
                        <ChatBottom inputValue={inputValue} handleInputChange={handleInputChange} inputRef={inputRef}/>

                    </div>
                )}
                </div>
            
            : <p style={{textAlign:"center"}}>Choose your chat</p>}
            
        </div>
    );
})

export default Chat;