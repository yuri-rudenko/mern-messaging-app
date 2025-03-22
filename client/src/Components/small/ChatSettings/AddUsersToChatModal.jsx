import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, useToaster } from 'rsuite';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import { getUsersInChats, getUsersNotInChat } from '../../../http/userAPI';
import './chatSettingsStyles.css';
import PeoplesIcon from '@rsuite/icons/Peoples';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import UserSmall from '../UserSmall/userSmall';
import { addUsers } from '../../../http/chatAPI';
import NotificationModal from '../Notifications/Notification';

const AddUsersToChatModal = observer(({setOpenFirst}) => {

    const {chat, app} = useContext(Context);

    const toaster = useToaster()

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
        setSelectedUsers([]);
    }

    const handleClose = () => {
        setOpenFirst(false);
        app.setAddMembersListModalOpened(false);
    }

    const toggleAddUsers = async () => {
        const data = await addUsers(selectedUsers, chat.activeChat._id);
        if(data) {
            handleClose();
            toaster.push(<NotificationModal 
                text={
                    selectedUsers.length > 1 ? "Users has been added to the chat" : "User have been added to the chat"
                }
                type="success"
            />)

        }
        setSelectedUsers([]);
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
                    {users && users.map(user => {

                        const found = selectedUsers.find(selected => selected._id === user._id);

                        const changeSelection = () => {
                            found ? setSelectedUsers(selectedUsers.filter(selected => selected._id !== user._id))
                            : setSelectedUsers([...selectedUsers, user]);
                                
                        }
                        
                        return (
                            <div style={{cursor: "pointer"}} onClick={changeSelection} key={user._id} className={found ? "add-user-container selected-user" : "add-user-container"}>
                                <UserSmall user={user}/>
                            </div>
                        )
                    })}

                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={toggleAddUsers} size="lg" appearance="primary">
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
