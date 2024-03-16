import { makeAutoObservable } from 'mobx';

export default class AppStore {
    constructor() {
        this._creatingChatName = '';
        this._creatingChatPicture = {};
        this._secondChatCreationOpened = false;
        this._addMembersListModalOpened = false;
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
}