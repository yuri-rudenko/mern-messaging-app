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