import { makeAutoObservable } from 'mobx';

export default class ChatStore {
    
    constructor() {
        this._chats = [];
        this._activeChat = {};
        this._messageAutoFocus = true;
        this._chatIsLoading = false;
        this._messageInput = "";
        makeAutoObservable(this);
    }

    setChats(chats) {
        this._chats = chats;
        this.sortChats();
    }

    appendChat(chat) {
        this._chats.unshift(chat);
    }

    setActiveChat(chat) {
        this._activeChat = chat;
    }

    setMessageInput(value) {
        this._messageInput = value;
    }

    resetMessageInput() {
        this._messageInput = "";
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
            const createdAtA = a.latestMessage ? new Date(a.latestMessage.createdAt) : new Date(a.createdAt);
            const createdAtB = b.latestMessage ? new Date(b.latestMessage.createdAt) : new Date(b.createdAt);
            return createdAtB - createdAtA;
        })
        
    }

    setMessageAutoFocus(bool) {
        this._messageAutoFocus = bool;
    }

    setChatIsLoading(bool) {
        this._chatIsLoading = bool;
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

    get chatIsLoading() {
        return this._chatIsLoading;
    }

    get messageInput() {
        return this._messageInput;
    }
}