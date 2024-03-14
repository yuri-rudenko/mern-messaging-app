import { makeAutoObservable } from 'mobx';

export default class ChatStore {
    constructor() {
        this._chats = [];
        this._activeChat = {};
        this._messageAutoFocus = true;
        makeAutoObservable(this);
    }

    setChats(chats) {
        this._chats = chats;
    }

    appendChat(chat) {
        this._chats.push(chat);
    }

    setActiveChat(chat) {
        this._activeChat = chat;
    }

    appendMessage(message) {
        this._activeChat.messages.push(message);
    }
    
    setLatestMessage(message) {
        if(this._activeChat?._id === message.chatId) {
            this._activeChat.latestMessage = message;
        }

        this._chats.forEach(chat => {
            if(chat._id === message.chatId) {
                chat.latestMessage = message;
            }
        })
    }

    sortChats() {
        
        this._chats.sort((a,b) => {
            const createdAtA = a.latestMessage ? new Date(a.latestMessage.createdAt) : new Date(0);
            const createdAtB = b.latestMessage ? new Date(b.latestMessage.createdAt) : new Date(0);
            return createdAtB - createdAtA;
        })
        
    }

    setMessageAutoFocus(bool) {
        this._messageAutoFocus = bool;
    }

    get chats() {
        return this._chats;
    }

    get messageAutoFocus() {
        return this._messageAutoFocus;
    }

    get activeChat() {
        return this._activeChat;
    }
}