import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const ChatsMenu = observer(() => {
    const { user } = useContext(Context);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (user.user.chats) {
            setChats(user.user.chats);
            console.log(user.user.chats[0], 123);
        }
    }, [user.user]);

    return (
        <div className='chats-menu'>
            {chats && chats.map(chat => (
                
                <div className="left-chat" key={chat._id}>
                    <div className="left">
                        <img className='chat-picture' src={chat.displayPicture} alt="" />
                    </div>

                    <div className="right">
                        <div className="top">
                            <p className='chat-name'>{chat.name}</p>
                            <p className='time'>{new Date(chat.latestMessage.createdAt).getHours()}:{new Date(chat.latestMessage.createdAt).getMinutes()}</p> 
                        </div>
                        <div className="bottom">
                            <p className='author'>{chat.latestMessage.author.name.split(" ")[0]}: </p> 
                            <p className='text'>{chat.latestMessage.text}</p>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
});

export default ChatsMenu;
