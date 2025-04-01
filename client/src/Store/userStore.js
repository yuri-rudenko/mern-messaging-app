import { makeAutoObservable } from 'mobx';

export default class UserStore {

    constructor() {
        this._isAuth = false;
        this._user = {};
        this._loading = true;
        this._loginError = false;
        makeAutoObservable(this, {}, {deep: true});
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
    }

    setLoading(bool) {
        this._loading = bool;
    }

    setLoginError(bool) {
        this._loginError = bool;
    }

    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get loading() {
        return this._loading;
    }

    get loginError() {
        return this._loginError;
    }
}