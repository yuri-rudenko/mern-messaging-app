import React, { useContext, useRef } from 'react';
import '../Pages/styles/messages.css';
import { Popover, Whisper } from 'rsuite';
import MessageModal from './small/MessageModal/MessageModal';
import { Context } from '..';

const Message = ({ message, user }) => {

    const { app } = useContext(Context);
    const ref = useRef();

    function handleMessageEvents(eventKey, message) {
        switch(eventKey) {
            case 1:
                app.setReplyingTo(message);
                break;
            case 2:
            case 3:
            case 4:
                break;
            default:
                break;
        }
    }

    function handleSelectMenu(eventKey, event) {
        handleMessageEvents(eventKey, message);
        ref.current.close();
    }

    const author = message.author;
    const isCurrentUser = author._id === user._id;
    const containerClass = isCurrentUser ? "message-container you-user flex-end" : "message-container other-user";

    return (
        <div className={containerClass}>
            <Whisper
                placement="top" 
                trigger="contextMenu" 
                speaker={<MessageModal onSelect={handleSelectMenu} />}
                ref={ref}
            >
                <div className='message'>
                {message?.responseTo?._id && 
                    <div className='message-responseTo-body'>
                        {message?.responseTo?.type == "Image" &&
                            <div className="message-responseTo-image">
                                 
                                <img src={process.env.REACT_APP_API_URL + '/'+ message.responseTo.files[0].src}></img>
                                
                            </div>
                        }
                        <div className="message-responseTo-right">

                            <div className="response-author">{message.responseTo.author.name}</div>
                            <div className="response-content">
                                <div className="response-image"></div>
                                <div className="response-text">{message.responseTo.text}</div>
                            </div>

                        </div>
                    </div>
                }
                    <div className="message-data">
                        <div className="author-image">
                            <img src={process.env.REACT_APP_API_URL + '/' + author.image} alt="pfp" />
                        </div>
                        <div className="content">
                            <p className='message-author'>{author.name}</p>
                            {message.type === "Text" && (
                                <p className='message-text'>{message.text}</p>
                            )}

                            {message.type === "Image" && (
                                <>
                                    <div className={'message-images container message-images-' + message.files.length}>
                                        {message.files && message.files.map(file => (
                                            <img
                                                className={'chat-message-image chat-message-image-' + message.files.length}
                                                src={process.env.REACT_APP_API_URL + '/' + file.src}
                                                key={file.src}
                                                alt="message content"
                                            />
                                        ))}
                                    </div>
                                    {message.text && <div className='message-text chat-message-image-text'>{message.text}</div>}
                                </>
                            )}
                        </div>
                    </div>
                    
                </div>
            </Whisper>
        </div>
    );
}

export default Message;
