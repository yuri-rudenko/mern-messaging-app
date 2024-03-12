import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button, Uploader } from 'rsuite';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import { deleteImage } from '../../../http/chatAPI';
import { Context } from '../../..';
import './modalStyles.css'

const ChatCreationFirst = ({open, setOpen}) => {

    const {app, chat} = useContext(Context);

    useEffect(() => {
        chat.setMessageAutoFocus(!open);
    }, [open])

    const handleClose = () => {
        setOpen(false);
        if(groupPfp.img) deleteImage(groupPfp.img);
    }

    const handleCloseNext = () => {
        if(!groupName) return;
        setOpen(false);
        app.setCreatingChatName(groupName);
        app.setCreatingChatPicture(groupPfp);
        app.setSecondChatCreationOpened(true);
    } 
    
    const [notUpload, setNotUpload] = useState([]);

    const [groupPfp, setGroupPfp] = useState({});
    const [groupName, setGroupName] = useState('');

    const [error, setError] = useState(false);

    const onUploadError = () => {
        setGroupPfp({});
        setError(true);
    }

    const handleExit = () => {
        setGroupPfp({});
        setGroupName("");
        setError(false);
    }

    const onUploadSuccess = (image) => {
        setGroupPfp(image);
        setError(false);
    }

    return (
        <div>
            <Modal size="xs" open={open} onExited={handleExit} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Create new chat</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="modal-choose-container">
                            <Uploader 
                            onError={onUploadError} 
                            onSuccess={onUploadSuccess} 
                            onChange={() => setNotUpload([])} 
                            fileList={notUpload} 
                            listType="picture" 
                            action={process.env.REACT_APP_API_URL + '/api/chat/uploadPfp'}>
                                <button style={error ? {border: "4px solid red"} : {border: "1px solid black"}}>
                                    {
                                        groupPfp.img ? <img style={{height: "100%", width: "100%"}} src={process.env.REACT_APP_API_URL + '/' + groupPfp.img}></img> 
                                        :  <CameraRetroIcon />
                                    }
                                </button>
                            </Uploader>
                            <div className="right">
                                <p>Enter name of the chat</p>
                                <input value={groupName} onChange={e => setGroupName(e.target.value)} type="text" className='input-chat-name'/>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleCloseNext} size="lg" appearance="primary">
                            Next
                        </Button>
                        <Button onClick={handleClose} size="lg" appearance="ghost">
                            Cancel
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChatCreationFirst;
