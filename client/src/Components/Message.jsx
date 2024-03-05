import React from 'react';

const Message = ({message, user}) => {
    const author = message.author;
    
    return (
        <div className={author._id === user._id ? "message-container you-user flex-end" : "message-container other-user "}>

            <div className='message'>
                <div className="author-image">
                    <img src={author.image} alt="pfp"/>
                </div>
                <div className="content">
                    <p className='message-author'>{author.name}</p>
                    <p className='message-text'>{message.text}</p>
                </div>
            </div>

        </div>

    );
}

export default Message;
