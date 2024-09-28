import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Placeholder, Uploader } from 'rsuite';
import AttachmentIcon from '@rsuite/icons/Attachment';
import ImageMessageModal from './ImageMessageModal';
import { Context } from '../../..';

const ChatBottom = observer(({inputValue, handleInputChange, inputRef}) => {

    const [notUpload, setNotUpload] = useState([]);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [modalOpened, setModalOpened] = useState(false);

    const chatContext = useContext(Context).chat;

    const handleOpen = () => setModalOpened(true);
    const handleClose = () => setModalOpened(false);


    return (
        <div>
            <div className="chat-bottom">
                <Uploader 
                multiple 
                className='uploader'
                listType="picture" 
                onChange={() => setNotUpload([])} 
                fileList={notUpload}
                maxPreviewFileSize={128}
                onSuccess={(result) => {
                    handleOpen();
                    setUploadedPhotos((prevPhotos) => {
                        const filesLength = [...prevPhotos, result].length
                        if(filesLength > 5) return [...prevPhotos]
                        return [...prevPhotos, result]
                    });
                }}
                action={process.env.REACT_APP_API_URL + '/api/files/uploadImage'}
                >
                    <button style={{height:"50px", width:"50px", borderRadius:"10px 0px 0px 10px"}}>
                        <AttachmentIcon height={"20px"} width={"20px"}/>
                    </button>
                </Uploader>
                <input value={chatContext.messageInput} onChange={handleInputChange} ref={inputRef} autoFocus className='write-message' placeholder='Write a message...'></input>
            </div>
            <ImageMessageModal modalOpened={modalOpened} handleClose={handleClose} uploadedPhotos={uploadedPhotos} setUploadedPhotos={setUploadedPhotos}/>
        </div>
    );
})

export default ChatBottom;
