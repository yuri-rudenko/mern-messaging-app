import React from 'react';
import Header from './Header';
import ChatsMenu from './ChatsMenu';
import Chat from './Chat';

const Main = () => {
    return (
        <div>
            <Header/>
            <ChatsMenu/>
            <Chat/>
        </div>
    );
}

export default Main;
