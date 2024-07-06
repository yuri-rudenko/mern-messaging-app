import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Placeholder, Uploader } from 'rsuite';
import AttachmentIcon from '@rsuite/icons/Attachment';
import ImageMessageModal from './ImageMessageModal';

const ChatBottom = observer(({inputValue, handleInputChange, inputRef}) => {

    const [notUpload, setNotUpload] = useState([]);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [modalOpened, setModalOpened] = useState(false);

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
                onSuccess={(result) => {
                    handleOpen();
                    setUploadedPhotos((prevPhotos) => [...prevPhotos, result]);
                }}
                action={process.env.REACT_APP_API_URL + '/api/files/uploadImage'}
                >
                    <button style={{height:"50px", width:"50px", borderRadius:"10px 0px 0px 10px"}}>
                        <AttachmentIcon height={"20px"} width={"20px"}/>
                    </button>
                </Uploader>
                <input value={inputValue} onChange={handleInputChange} ref={inputRef} autoFocus className='write-message' placeholder='Write a message...'></input>
            </div>
            <ImageMessageModal modalOpened={modalOpened} handleClose={handleClose} uploadedPhotos={uploadedPhotos} setUploadedPhotos={setUploadedPhotos}/>
        </div>
    );
})

export default ChatBottom;
