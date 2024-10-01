import React, { useContext, useRef } from 'react';
import '../Pages/styles/messages.css'
import { Popover, Whisper } from 'rsuite';
import MessageModal from './small/MessageModal/MessageModal';
import { Context } from '..';

const Message = ({message, user}) => {

    const { app } = useContext(Context);

    function handleMessageEvents(eventKey, message) {
        switch(eventKey) {
            case 1:
                app.setReplyingTo(message);
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
        }
    }

    const author = message.author;

    const ref = useRef();
    function handleSelectMenu(eventKey, event) {
        handleMessageEvents(eventKey, message)
        ref.current.close();
    }
    
    if (message.type == "Text") return (

        <div className={author._id === user._id ? "message-container you-user flex-end" : "message-container other-user "}>

            <Whisper
                placement="top" 
                trigger="contextMenu" 
                speaker={<MessageModal onSelect={handleSelectMenu}/>}
                ref={ref}
            >

            <div className='message'>
                <div className="author-image">
                    <img src={process.env.REACT_APP_API_URL + '/' + author.image} alt="pfp"/>
                </div>
                <div className="content">
                    <p className='message-author'>{author.name}</p>
                    <p className='message-text'>{message.text}</p>
                </div>
            </div>

            </Whisper>

        </div>

    );
    if (message.type == "Image") return (
        <div className={author._id === user._id ? "message-container you-user flex-end" : "message-container other-user "}>

            <div className='message'>
                <div className="author-image">
                    <img src={process.env.REACT_APP_API_URL + '/' + author.image} alt="pfp"/>
                </div>
                <div className="content">
                    <p className='message-author'>{author.name}</p>
                    <div className={'message-images container message-images-' + message.files.length}>
                        {message.files && message.files.map(file => (

                        <img className={'chat-message-image chat-message-image-' + message.files.length} src={process.env.REACT_APP_API_URL + '/'+ file.src} key={file.src}></img>
                        
                        ))}
                    </div>
                    {message.text && <div className='message-text chat-message-image-text'>{message.text}</div>}
                </div>
            </div>

        </div>
    );
}

export default Message;
