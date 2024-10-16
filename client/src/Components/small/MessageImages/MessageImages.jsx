import React, { useState } from 'react';
import ImgsViewer from 'react-images-viewer';

const MessageImages = ({ message }) => {
    const [viewerOpened, setViewerOpened] = useState(false);
    const [currImg, setCurrImg] = useState(0);

    return (
        <div>
            <ImgsViewer
                imgs={message.files.map(file => ({ src: process.env.REACT_APP_API_URL + '/' + file.src }))}
                currImg={currImg}
                isOpen={viewerOpened}
                onClickPrev={() => {
                    if (currImg > 0) setCurrImg(currImg - 1);
                }}
                onClickNext={() => {
                    if (currImg < message.files.length - 1) setCurrImg(currImg + 1);
                }}
                onClose={() => setViewerOpened(false)}
                backdropCloseable={true}
                showThumbnails={true}
                onClickThumbnail={(index) => {
                    setCurrImg(index);
                    setViewerOpened(true);
                }}
            />
            <div className={'message-images container message-images-' + message.files.length}>
                {message.files && message.files.map((file, index) => (
                    <img
                        className={'chat-message-image chat-message-image-' + message.files.length}
                        src={process.env.REACT_APP_API_URL + '/' + file.src}
                        key={file.src}
                        alt="message content"
                        onClick={() => {
                            setViewerOpened(true);
                            setCurrImg(index);
                        }}
                    />
                ))}
            </div>
            {message.text && <div className='message-text chat-message-image-text'>{message.text}</div>}
        </div>
    );
}

export default MessageImages;
