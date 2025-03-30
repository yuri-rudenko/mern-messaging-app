import { useContext } from "react";
import { Context } from "..";
import { sendMessage } from "../http/messageAPI";
import scrollToBottom from "./scrollToBottom";

export const useSendMessage = (socket) => {
    
    const { user, app } = useContext(Context);
    const chatContext = useContext(Context).chat;

    const sendMessageAndUpdate = async (content) => {

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

                app.resetReplyingTo();

                setTimeout(scrollToBottom, 10);

                return message;
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return sendMessageAndUpdate;
};
