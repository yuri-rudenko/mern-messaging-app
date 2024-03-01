import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const ChatsMenu = observer(() => {
    const { user } = useContext(Context);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (user.user) {
            setChats(user.user.chats);
            console.log(chats);
        }
    }, [user.user]);

    return (
        <div>
            {chats && chats.map(chat => (<p key={chat._id}>{chat.name}</p>))}
        </div>
    );
});

export default ChatsMenu;
