import { useContext, useEffect, useRef } from "react";
import { Context } from "..";
import { sendMessage } from "../http/messageAPI";
import { scrollToBottom } from "../Components/Chat";
import { io } from "socket.io-client";

export const useSendMessage = () => {
    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;

    const socketRef = useRef(null);

    useEffect(() => {

        socketRef.current = io(process.env.REACT_APP_API_URL, {
            reconnectionAttempts: 5,
            reconnectionDelay: 1000, 
            reconnectionDelayMax: 5000, 
            timeout: 10000,
        });

        return () => {
            
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []); 

    // returns this function
    const sendMessageAndUpdate = async (content) => {

        const socket = socketRef.current;

        if (!socket) {
            console.error('Socket not initialized');
            return;
        }

        try {
            const { message } = await sendMessage({
                ...content,
                id: user.user._id,
                chatId: chatContext.activeChat._id
            });

            if (message) {
                socket.emit('new message', {
                    message,
                    chat: chatContext.activeChat,
                    sender: user.user
                });

                chatContext.appendMessage(message);
                chatContext.setLatestMessage(message);
                chatContext.sortChats();

                setTimeout(() => {
                    scrollToBottom();
                }, 10);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return sendMessageAndUpdate;
};
