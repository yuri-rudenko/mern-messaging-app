import React, { useContext, useState } from 'react';
import { Button, Modal } from 'rsuite';
import './imageMessageModalStyle.css';
import { deleteImage } from '../../../http/chatAPI';
import { Context } from '../../..';
import { useSendMessage } from '../../../functions/useSendMessage';

const ImageMessageModal = ({modalOpened, handleClose, uploadedPhotos, setUploadedPhotos}) => {

    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;
    const sendMessageAndUpdate = useSendMessage();

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

        const message = await sendMessageAndUpdate({
            content: {
                type: 'Image',
                files: images
            },
        });

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
                onClose={handleModalClose}
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
                <Modal.Footer>
                    <Button onClick={sendFileMessage} appearance="primary">
                        Send
                    </Button>
                    <Button onClick={handleModalClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ImageMessageModal;
