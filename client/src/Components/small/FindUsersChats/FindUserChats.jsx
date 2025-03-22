import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'rsuite';
import { Context } from '../../..';
import { getAllUsers } from '../../../http/userAPI';

const FindUserChats = ({ open, setOpen }) => {

    const { app, chat, user } = useContext(Context);

    const [chats, setChats] = useState([]);

    useEffect(() => {
        chat.setMessageAutoFocus(!open);
    }, [open])

    const handleExit = () => {

    }

    const handleClose = () => {
        setOpen(false);
    }

    const findUsers = async (name) => {
        if(!name || name === ' ') {
            setChats([]);
            return;
        }
        const foundUsers = await getAllUsers(name);
        setChats(foundUsers);
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
                        chats.map(chat => <div>{chat.name}</div>)
                    }

                </Modal.Body>

            </Modal>
        </div>
    );
}

export default FindUserChats;
