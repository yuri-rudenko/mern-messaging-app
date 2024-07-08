import React, { useContext } from 'react';
import { Button, Modal } from 'rsuite';
import './imageMessageModalStyle.css';
import { deleteImage } from '../../../http/chatAPI';
import { Context } from '../../..';
import { sendMessage } from '../../../http/messageAPI';

const ImageMessageModal = ({modalOpened, handleClose, uploadedPhotos, setUploadedPhotos}) => {

    const { user } = useContext(Context);
    const chatContext = useContext(Context).chat;


    function removeImage(name) {

        setUploadedPhotos((prevPhotos => prevPhotos.filter(photo => photo !== name)));
        deleteImage(name);

    }

    function removeAllImages() {
        uploadedPhotos.forEach(photo => {
            deleteImage(photo);
        })
        setUploadedPhotos([]);
    }

    const sendFileMessage = async () => {

        const images = uploadedPhotos.map(photo => ({
            type: 'Image',
            src: photo
        }))
        
        const {message} = await sendMessage({
            content: {
                type: 'Image',
                files: images
            },
            id: user.user._id,
            chatId: chatContext.activeChat._id
        })

        console.log(message)
    }

    return (
        <div>
            <Modal onExited={() => removeAllImages()} className='messageImage-modal' open={modalOpened} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Send pictures</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body'>
                    <div className="images">

                        {uploadedPhotos[0] && uploadedPhotos.map(image => 
                            <div key={image} className="uploadable-image">
                                <img src={process.env.REACT_APP_API_URL + '/' + image}></img>
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
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ImageMessageModal;
