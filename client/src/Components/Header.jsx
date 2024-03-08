import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { Dropdown } from 'rsuite';
import 'rsuite/Dropdown/styles/index.css';
import menuIcon from '../images/menu.svg';
import { useNavigate } from 'react-router-dom';

const Header = observer(() => {
    const { user, chat } = useContext(Context);
    const [userApp, setUser] = useState([]);

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

    useEffect(() => {
        if (user.user) {
            setUser(user.user);
        }
    }, [user.user]);

    return (
        <div className='header'>
            <div className="left">
                <img src={menuIcon} alt="MENU" className='menu-icon'/>
                <h1>Message.app</h1>
            </div>
            <Dropdown trigger="click" renderToggle={renderButton}>
                <Dropdown.Item style={{fontSize: "18px"}}>Profile</Dropdown.Item>
                <Dropdown.Item style={{fontSize: "18px", minWidth: "150px"}}>Friends</Dropdown.Item>
                <Dropdown.Separator/>
                <Dropdown.Item onClick={logout} style={{fontSize: "18px", color: "Red"}}>Log off</Dropdown.Item>
            </Dropdown>
                

        </div>
    );
})

export default Header;
