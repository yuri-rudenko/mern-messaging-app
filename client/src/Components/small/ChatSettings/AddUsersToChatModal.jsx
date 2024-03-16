import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'rsuite';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import { getUsersInChats, getUsersNotInChat } from '../../../http/userAPI';
import './chatSettingsStyles.css';
import PeoplesIcon from '@rsuite/icons/Peoples';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import UserSmall from '../UserSmall/userSmall';

const AddUsersToChatModal = observer(() => {

    const {chat, app} = useContext(Context);
    const userContext = useContext(Context).user;

    const [users, setUsers] = useState([]);
    const [constUsers, setConstUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [activeSubmit, setActiveSubmit] = useState(true);

    useEffect(() => {

        const getUsersData = async () => {
            const data = await getUsersNotInChat(chat.activeChat._id);
            setConstUsers(data.users);
            setUsers(data.users);
        };

        getUsersData();

    }, [chat.activeChat])

    const handleExit = () => {

    }

    const handleClose = () => {
        app.setAddMembersListModalOpened(false);
    }


    return (
        chat.activeChat.createdAt &&
        <Modal size="xs" className='chat-settings-modal' open={app.addMembersListModalOpened} onClose={handleClose} onExited={handleExit}>
            <Modal.Header>
                <Modal.Title>Add Users</Modal.Title>
            </Modal.Header>

            <Modal.Body>

            </Modal.Body>

            <Modal.Footer>
                   
            </Modal.Footer>
        </Modal>
    );
})

export default AddUsersToChatModal;
