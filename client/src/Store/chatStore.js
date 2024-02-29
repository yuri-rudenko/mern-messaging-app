import { makeAutoObservable } from 'mobx';

export default class ChatStore {
    constructor() {
        this._chats = [];
        this._activeChat = {};
        makeAutoObservable(this);
    }

    setChats(chats) {
        this._chats = chats;
    }

    setActiveChat(chat) {
        this._activeChat = chat;
    }

    get chats() {
        return this._chats;
    }

    get activeChat() {
        return this._activeChat;
    }
}