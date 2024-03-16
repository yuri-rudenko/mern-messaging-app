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
        chat.setMessageAutoFocus(!app.addMembersListModalOpened);
    }, [app.addMembersListModalOpened])

    useEffect(() => {

        const getUsersData = async () => {
            const data = await getUsersNotInChat(chat.activeChat._id);
            setConstUsers(data.users);
            console.log(data.users);
            setUsers(data.users);
        };

        getUsersData();

    }, [chat.activeChat])

    const handleExit = () => {

    }

    const handleClose = () => {
        app.setAddMembersListModalOpened(false);
    }

    const filterUsers = (value) => {
        if(!value) {
            setUsers(constUsers);
            return;
        }
        setUsers(constUsers.filter(client => client.name.toLowerCase().includes(value.toLowerCase()) || client.tag.toLowerCase().includes(value.toLowerCase())));
    }


    return (
        chat.activeChat.createdAt &&
        <Modal size="xs" className='add-users' open={app.addMembersListModalOpened} onClose={handleClose} onExited={handleExit}>
            <Modal.Header>
                <Modal.Title>Add Users</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="add-users-container">

                    <input onChange={(e) => filterUsers(e.target.value)} type='text' placeholder='Search users'></input>

                    <div className="users-container">
                    {users && users.map(user => (
                        <UserSmall key={user._id} user={user}/>
                    ))}

                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleClose} size="lg" appearance="primary">
                    Submit
                </Button>
                <Button onClick={handleClose} size="lg" appearance="ghost">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
})

export default AddUsersToChatModal;
