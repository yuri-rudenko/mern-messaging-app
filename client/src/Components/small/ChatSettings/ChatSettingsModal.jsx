import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'rsuite';
import { Context } from '../../..';
import { observer } from 'mobx-react-lite';
import { getUsersInChats } from '../../../http/userAPI';
import './chatSettingsStyles.css';
import PeoplesIcon from '@rsuite/icons/Peoples';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import UserSmall from '../UserSmall/userSmall';

const ChatSettingsModal = observer(({open, setOpen}) => {

    const {chat, app} = useContext(Context);

    useEffect(() => {
        chat.setMessageAutoFocus(!open);
    }, [open])
    
    const handleExit = () => {

    }

    const handleClose = () => {
        setOpen(false);
    }


    return (
        chat.activeChat.createdAt &&
        <Modal size="xs" className='chat-settings-modal' open={open} onExited={handleExit} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Chat Information</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="settings-container">
                    <div className="chat-information">
                        <div className="left">
                            <img src={process.env.REACT_APP_API_URL + '/' + chat.activeChat.displayPicture} alt='Chat picture'></img>
                        </div>
                        <div className="right">
                            <p className='name'>{chat.activeChat.name}</p>
                            <p className='members-amount'>{chat.activeChat.users.length} Members</p>
                        </div>
                    </div>
                    <div className="chat-members">
                        <div className="members-header">
                            <div className="left">
                                <PeoplesIcon height="20px" width="20px"/>
                                <p>{chat.activeChat.users.length} Members</p>
                            </div>
                            <AddOutlineIcon onClick={() => app.setAddMembersListModalOpened(true)} className='add-users-icon' height="24px" width="24px"/>
                        </div>
                        <div className="members">
                            {chat.activeChat.users.map(user => (
                                <UserSmall key={user._id} user={user}/>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                   
            </Modal.Footer>
        </Modal>
    );
})

export default ChatSettingsModal;
