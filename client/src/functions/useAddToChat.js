import { useContext } from "react";
import { Context } from "..";
import { sendMessage } from "../http/messageAPI";
import scrollToBottom from "./scrollToBottom";

export const useAddToChat = (socket) => {

    const chatContext = useContext(Context).chat;

    const addToChatAndUpdate = async (chat, usersToAdd) => {

        console.log(chat, usersToAdd, "TESTING");

        if (!socket) {
            console.error('Socket not initialized');
            return;
        }

        try {

            if (chat) {
                const addedChat = socket.emit('add to chat', {
                    usersToAdd,
                    chat,
                });

                if(addedChat._id) chatContext.appendChat(addedChat);

                return addedChat;
            }
        } catch (error) {
            console.error('Failed to add to Chat', error);
        }
    };

    return addToChatAndUpdate;
};
