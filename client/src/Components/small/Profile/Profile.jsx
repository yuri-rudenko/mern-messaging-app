import React, { useContext, useEffect, useState } from 'react';
import { Modal, Uploader } from 'rsuite';
import { Context } from '../../..';
import { SocketContext } from '../../../App';
import './profile.css';

const Profile = ({ open, setOpen }) => {

    const { app, chat, user } = useContext(Context);
    const socket = useContext(SocketContext);

    useEffect(() => {
        chat.setMessageAutoFocus(!open);
    }, [open])

    const handleExit = () => {

    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Modal size={510} open={open} onExited={handleExit} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title style={{ textAlign: "center" }}>Profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className='profile-modal-body'>
                    <div className="profile-modal-body-content">
                        <div className="image">
                            <img style={{ height: "90px" }} src={process.env.REACT_APP_API_URL + '/' + user.user.image}></img>
                            <Uploader>
                                <div>UPLOADER</div>
                            </Uploader>
                        </div>
                        <div className="name">{user.user.name}</div>
                    </div>
                </div>

            </Modal.Body>

        </Modal>
    );
}

export default Profile;
