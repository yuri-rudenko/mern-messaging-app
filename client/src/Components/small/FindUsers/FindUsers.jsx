import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'rsuite';
import { Context } from '../../..';
import { getAllUsers } from '../../../http/userAPI';
import UserSmall from '../UserSmall/userSmall';
import { checkAndCreateChat, createChat } from '../../../http/chatAPI';
import { useAddToChat } from '../../../functions/useAddToChat';
import { SocketContext, setChatNames } from '../../../App';

const FindUsers = ({ open, setOpen }) => {

    const { app, chat, user } = useContext(Context);
    const socket = useContext(SocketContext);

    const addToChatAndUpdate = useAddToChat(socket);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        chat.setMessageAutoFocus(!open);
    }, [open])

    const handleExit = () => {

    }

    const handleClose = () => {
        setOpen(false);
    }

    const findUsers = async (name) => {
        if (!name || name === ' ') {
            setUsers([]);
            return;
        }
        const foundUsers = await getAllUsers(name);
        setUsers(foundUsers);
    }

    const toggleChatCreation = async (filteredUser) => {
        const {data, chatExists} = await checkAndCreateChat("isNotGroup", undefined, [filteredUser], false);

        console.log(data, chatExists, "CHECK HERE");
        if(!chatExists) {
            chat.appendChat(setChatNames([data], user.user)[0]);
            addToChatAndUpdate(data, [filteredUser])
        }
        chat.setActiveChat(data);
        setOpen(false);
    }

    return (
        <div>
            <Modal size="sm" open={open} onExited={handleExit} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title style={{ textAlign: "center" }}>Find Users/Chats</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div className="search-users">
                        <input placeholder='Find users' type="text" onChange={(e) => findUsers(e.target.value)} />
                    </div>
                    {
                        users.map(filteredUser => <div key={filteredUser._id} onClick={() => toggleChatCreation(filteredUser)}><UserSmall user={filteredUser} /></div>)
                    }

                </Modal.Body>

            </Modal>
        </div>
    );
}

export default FindUsers;
