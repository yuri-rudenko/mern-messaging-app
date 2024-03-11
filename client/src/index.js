import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './Store/userStore';
import ChatStore from './Store/chatStore';
import AppStore from './Store/appStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Context.Provider value={{
        user: new UserStore(),
        chat: new ChatStore(),
        app: new AppStore(),
    }}>

        <App />

    </Context.Provider>

);
