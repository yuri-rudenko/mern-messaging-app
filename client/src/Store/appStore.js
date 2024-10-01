import { makeAutoObservable } from 'mobx';

export default class AppStore {
    constructor() {
        this._creatingChatName = '';
        this._creatingChatPicture = {};
        this._secondChatCreationOpened = false;
        this._addMembersListModalOpened = false;
        this._replyingTo = {};
        makeAutoObservable(this);
    }

    setCreatingChatName(str) {
        this._creatingChatName = str;
    }

    setCreatingChatPicture(img) {
        this._creatingChatPicture = img;
    }

    setSecondChatCreationOpened(bool) {
        this._secondChatCreationOpened = bool;
    }

    setAddMembersListModalOpened(bool) {
        this._addMembersListModalOpened = bool;
    }

    setReplyingTo(message) {
        this._replyingTo = message;
    }

    resetReplyingTo() {
        this._replyingTo = {};
    }

    get creatingChatName() {
        return this._creatingChatName;
    }

    get creatingChatPicture() {
        return this._creatingChatPicture;
    }

    get secondChatCreationOpened() {
        return this._secondChatCreationOpened;
    }

    get addMembersListModalOpened() {
        return this._addMembersListModalOpened;
    }
    
    get replyingTo() {
        return this._replyingTo;
    }
}