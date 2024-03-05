import React, { useContext, useEffect } from 'react';
import Header from '../Components/Header';
import ChatsMenu from '../Components/ChatsMenu';
import Chat from '../Components/Chat';
import { check, getUser } from '../http/userAPI';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import './styles/main.css';

const Main = observer(() => {

    const {user} = useContext(Context);

    const navigate = useNavigate();

    useEffect(() => {
        
        const checkUser = async() => {
            // loading
            const token = await check();
    
            if(!token) navigate('/login');
    
            const foundUser = await getUser(token.tag);

            if(foundUser.status == 400) navigate('/login');
    
            user.setUser(foundUser);

        }
    
        checkUser();
    }, [user, navigate]);

    return (
        <div className='main'>
            <Header/>
            <div className="body">
                <ChatsMenu/>
                <Chat/>
            </div>
        </div>
    );
})

export default Main;
