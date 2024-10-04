import { useContext, useEffect, useRef } from "react";
import { Context } from "..";
import { sendMessage } from "../http/messageAPI";
import { io } from "socket.io-client";
import scrollToBottom from "./scrollToBottom";

export const useSendMessage = () => {
    const { user, app } = useContext(Context);
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

            const messagePayload = {
                ...content,
                id: user.user._id,
                chatId: chatContext.activeChat._id,
            };
        
            if (app.replyingTo?._id) {
                messagePayload.responseTo = app.replyingTo._id;
            }
        
            const { message } = await sendMessage(messagePayload);
        
            if (message) {
                socket.emit('new message', {
                    message,
                    chat: chatContext.activeChat,
                    sender: user.user
                });
        
                chatContext.appendMessage(message);
                chatContext.setLatestMessage(message);
                chatContext.sortChats();
                console.log(message.responseTo)
        
                setTimeout(scrollToBottom, 10); // Use direct reference to the function
        
                return message;
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return sendMessageAndUpdate;
};
