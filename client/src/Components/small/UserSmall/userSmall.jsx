import React from 'react';
import './userSmall.css';

const UserSmall = ({user, clickable, defaultStyle}) => {

    if(!clickable) clickable = false;
    if(!defaultStyle) defaultStyle = true;

    function onClick() {

    }

    return (
        <div className={defaultStyle ? "user-small" : null} onClick={clickable ? onClick: null}>
            <img src={process.env.REACT_APP_API_URL + '/' + user.image} alt=""/>
            <div className="right">
                <p className='name'>{user.name}</p>
                <p className='tag'>@{user.tag}</p>
            </div>
        </div>
    );
}

export default UserSmall;
