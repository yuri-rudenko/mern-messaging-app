import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Uploader } from 'rsuite';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import { deleteImage } from '../../../http/chatAPI';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import { getUsersInChats } from '../../../http/userAPI';
import './modalStyles.css';

const ChatCreationSecond = observer(() => {

    const {app, chat} = useContext(Context);
    const userContext = useContext(Context).user;

    useEffect(() => {
        chat.setMessageAutoFocus(!app.secondChatCreationOpened);
    }, [app.secondChatCreationOpened])

    const [users, setUsers] = useState([]);
    const [constUsers, setConstUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {

        const getUsersData = async () => {
            const data = await getUsersInChats(userContext.user._id);
            setConstUsers(data.users);
            setUsers(data.users);
        };

        getUsersData();

    }, [])

    const handleExit = () => {
        setSelectedUsers([]);
    }

    const handleClose = () => {
        app.setSecondChatCreationOpened(false);
    }

    const filterUsers = (value) => {
        if(!value) {
            setUsers(constUsers);
            return;
        }
        setUsers(constUsers.filter(client => client.name.toLowerCase().includes(value.toLowerCase()) || client.tag.toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <Modal size="xs" className='second-modal' open={app.secondChatCreationOpened} onClose={handleClose} onExited={handleExit}>
            <Modal.Header>
                <Modal.Title>Choose users</Modal.Title>
                </Modal.Header>
                <div className="search-users">
                        <input type="text" onChange={(e) => filterUsers(e.target.value)}/>
                </div>
                <Modal.Body style={{maxHeight: "500px"}}>
                    { users[0] ? users.map(user => {

                        const found = selectedUsers.find(selected => selected._id === user._id);

                        const changeSelection = () => {
                            found ? setSelectedUsers(selectedUsers.filter(selected => selected._id !== user._id))
                            : setSelectedUsers([...selectedUsers, user]);
                            
                        }

                        return (
                            <div onClick={changeSelection} key={user._id} className={found ? "add-user-container selected-user" : "add-user-container"}>
                                <img src={user.image} alt=""/>
                                <div className="right">
                                    <p className='name'>{user.name}</p>
                                    <p className='tag'>@{user.tag}</p>
                                </div>
                            </div>
                        )})
                    : <></>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button size="lg" appearance="primary">
                        Submit
                    </Button>
                    <Button onClick={handleClose} size="lg" appearance="ghost">
                        Cancel
                    </Button>
            </Modal.Footer>
        </Modal>
    );
})

export default ChatCreationSecond;
