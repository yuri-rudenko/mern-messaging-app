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
import { useSendMessage } from '../functions/useSendMessage';
import scrollToBottom from '../functions/scrollToBottom';
import handleImagesAndScroll from '../functions/handleImagesAndScroll';
import Loader from './small/Loader/Loader';
import { SocketContext } from '../App';
import { getChat } from '../http/chatAPI';


const Chat = observer(() => {

    const socket = useContext(SocketContext);

    const { user, app } = useContext(Context);
    const chatContext = useContext(Context).chat;
    const sendMessageAndUpdate = useSendMessage(socket);

    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const messagesRef = useRef(null);

    const handleScroll = async () => {
        if (!hasMore || !messagesRef.current) return;

        const messageContainer = messagesRef.current;
        const previousHeight = messageContainer.scrollHeight;

        if (messagesRef.current.scrollTop === 0) {
            const { chat } = await getChat(chatContext.activeChat._id, page);

            console.log(chat.messages);

            if (!chat.messages.length) {
                setHasMore(false);
                return;
            }

            chatContext.unshiftMessage(chat.messages);
            setHasMore(chat.hasMore);
            setPage(prev => prev + 1);

            setTimeout(() => {
                messageContainer.scrollTop = messageContainer.scrollHeight - previousHeight;
            }, 0);
        }
    };

    const inputRef = useRef();

    const loading = chatContext.chatIsLoading;
    const wrapSetLoading = (value) => {
        chatContext.setChatIsLoading(value);
    };
    const [socketConnected, setSocketConnected] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    const handleInputChange = (e) => {
        chatContext.setMessageInput(e.target.value);
    };

    useEffect(() => {
        const cleanup = handleImagesAndScroll(wrapSetLoading);
        chatContext.resetMessageInput();
        socket.emit('join chat', chatContext.activeChat);
        app.resetReplyingTo();
        setPage(2);
        setHasMore(true);
        return cleanup;
    }, [chatContext.activeChat]);

    useEffect(() => {

        const handleMessageReceived = (newMessageRecieved) => {

            if (!chatContext.activeChat._id || chatContext.activeChat._id !== newMessageRecieved.chat._id) {
                // Error
            }
            else {
                chatContext.appendMessage(newMessageRecieved.message);
                if (newMessageRecieved.message.type === "Image") {

                    setTimeout(() => {
                        handleImagesAndScroll();
                    }, 10)
                }

                else {

                    setTimeout(() => {
                        scrollToBottom();
                    }, 10)

                }

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

            const messageValue = chatContext.messageInput;

            if (chatContext.messageInput.trim() !== "" && key.key === "Enter") {
                chatContext.resetMessageInput()
                sendMessageAndUpdate({
                    content: {
                        type: 'Text',
                        text: messageValue,
                    }
                })
            }
            if (inputRef.current && chatContext.messageAutoFocus) {
                inputRef.current.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    if (loading) return <Loader />

    return (
        <div className='chat'>

            <ChatSettingsModal open={open} setOpen={setOpen} />
            <AddUsersToChatModal setOpenFirst={setOpen} />

            {chatContext.activeChat.createdAt &&
                <div className="chat-header">
                    <div className="chat-header-left">
                        <div className="pfp">
                            <img src={process.env.REACT_APP_API_URL + '/' + chatContext.activeChat.displayPicture} alt="Chat image" />
                        </div>
                        <div className="text">
                            <p className="name">{chatContext.activeChat.name}</p>
                            <p className='online'>Online 7m ago</p>
                        </div>
                    </div>
                    <div className="chat-header-right">
                        <MoreIcon height="40px" width="40px" onClick={handleOpen} />
                    </div>
                </div>
            }

            {chatContext.activeChat.users ? <div className={loading ? "main-chat hidden" : "main-chat"}>
                {chatContext.activeChat.messages[0]
                    ? (
                        <div className="messages">
                            <div className='messages-container' ref={messagesRef} onScroll={handleScroll}>
                                {chatContext.activeChat.messages.map(message =>
                                    <Message user={user.user} message={message} key={message._id}></Message>
                                )}
                            </div>
                            <ChatBottom handleInputChange={handleInputChange} inputRef={inputRef} />
                        </div>
                    )
                    : (
                        <div className="messages">

                            <p>Write your first message!</p>
                            <ChatBottom handleInputChange={handleInputChange} inputRef={inputRef} />

                        </div>
                    )}
            </div>

                : <p style={{ textAlign: "center" }}>Choose your chat</p>}

        </div>
    );
})

export default Chat;