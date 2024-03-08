import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { Modal, Button, Uploader, Dropdown } from 'rsuite';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import 'rsuite/dist/rsuite-no-reset.min.css';
import menuIcon from '../images/menu.svg';
import { useNavigate } from 'react-router-dom';

const Header = observer(() => {
    const { user, chat } = useContext(Context);
    const [userApp, setUser] = useState([]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);  

    const navigate = useNavigate();

    const logout = () => {
        user.setUser({});
        user.setIsAuth(false);
        chat.setActiveChat({});
        chat.setChats([]);
        localStorage.removeItem('token');
        navigate('/login');
    }

    const renderButton = (props, ref) => {
        return (
            <div {...props} ref={ref} className="user-menu">
                <p className='user-menu-name'>{userApp.name}</p>
                <img className='user-menu-image' src={userApp.image} alt="" />
            </div>
        );
    };

    const menuButton = (props, ref) => {
        return (
            <div {...props} ref={ref} className="menu-button">
                <img src={menuIcon} alt="MENU" className='menu-icon'/>
            </div>
        );
    }

    useEffect(() => {
        if (user.user) {
            setUser(user.user);
        }
    }, [user.user]);

    return (
        <div className='header'>
            <div className="left">
                <Dropdown trigger="click" renderToggle={menuButton}>
                    <Dropdown.Item style={{fontSize: "20px", color: "#00d2ff"}}>Profile</Dropdown.Item>
                    <Dropdown.Item onClick={handleOpen} style={{fontSize: "20px"}}>Create chat</Dropdown.Item>
                    <Dropdown.Item style={{fontSize: "20px", minWidth: "200px"}}>Find chat/user</Dropdown.Item>
                </Dropdown>
            <h1>Message.app</h1>
            </div>
            <Dropdown trigger="click" renderToggle={renderButton}>
                <Dropdown.Item style={{fontSize: "18px"}}>Profile</Dropdown.Item>
                <Dropdown.Item style={{fontSize: "18px", minWidth: "150px"}}>Friends</Dropdown.Item>
                <Dropdown.Separator/>
                <Dropdown.Item onClick={logout} style={{fontSize: "18px", color: "Red"}}>Log off</Dropdown.Item>
            </Dropdown>
                
            <Modal open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Create new chat</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-choose-container">
                            <Uploader listType="picture" action={process.env.REACT_APP_API_URL + '/api/chat/uploadPfp'}>
                                <button>
                                    <CameraRetroIcon />
                                </button>
                            </Uploader>
                            <div className="right">
                                <p>Enter name of the chat</p>
                                <input type="text" className='input-chat-name'/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose} size="lg" appearance="primary">
                            Next
                        </Button>
                        <Button onClick={handleClose} size="lg" appearance="ghost">
                            Cancel
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
})

export default Header;
