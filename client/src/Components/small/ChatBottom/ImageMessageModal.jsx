import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'rsuite';
import './imageMessageModalStyle.css';
import { deleteImage } from '../../../http/chatAPI';
import { Context } from '../../..';
import { useSendMessage } from '../../../functions/useSendMessage';
import { SocketContext } from '../../../App';

const ImageMessageModal = ({modalOpened, handleClose, uploadedPhotos, setUploadedPhotos}) => {

    const socket = useContext(SocketContext);
    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;
    const sendMessageAndUpdate = useSendMessage(socket);
    const [inputValue, setInputValue] = useState(chatContext.messageInput);

    useEffect(() => {
        chatContext.setMessageAutoFocus(!modalOpened);
        setInputValue(chatContext.messageInput);
    }, [modalOpened])

    const [sendButtonClicked, setSendButtonClicked] = useState(false);

    function removeImage(name) {
        setUploadedPhotos(prevPhotos => prevPhotos.filter(photo => photo !== name));
        deleteImage(name);
    }

    function removeAllImages() {
        uploadedPhotos.forEach(photo => {
            deleteImage(photo);
        });
        setUploadedPhotos([]);
    }

    const sendFileMessage = async () => {

        const images = uploadedPhotos.map(photo => ({
            type: 'Image',
            src: photo
        }));

        if (!inputValue.trim()) {
            const message = await sendMessageAndUpdate({
                content: {
                    type: 'Image',
                    files: images
                },
            });
        } else {
            const message = await sendMessageAndUpdate({
                content: {
                    type: 'Image',
                    files: images,
                    text: inputValue.trim()
                },
            });
            console.log(message);
        }

        setSendButtonClicked(true);
        setUploadedPhotos([]);
        handleClose();
    };

    const handleModalClose = () => {
        handleClose();
        if (!sendButtonClicked) {
            removeAllImages();
        }
        setSendButtonClicked(false); 
    };

    return (
        <div>
            <Modal
                className='messageImage-modal'
                open={modalOpened}
                onClose={handleClose}
                onExited={handleModalClose}
            >
                <Modal.Header>
                    <Modal.Title>Send pictures</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <div className="images">
                        {uploadedPhotos.length > 0 && uploadedPhotos.map(image =>
                            <div key={image} className="uploadable-image">
                                <img src={`${process.env.REACT_APP_API_URL}/${image}`} alt="uploaded" />
                                <div className="cross">
                                    <p onClick={() => removeImage(image)}>x</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <input placeholder='Message...' value={inputValue} onChange={e => setInputValue(e.target.value)} type="text" className='input-chat-name'/>
                <Modal.Footer>
                    <Button onClick={sendFileMessage} appearance="primary">
                        Send    
                    </Button>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ImageMessageModal;
