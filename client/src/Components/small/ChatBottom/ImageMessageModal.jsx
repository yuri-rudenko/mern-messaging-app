import React from 'react';
import { Button, Modal } from 'rsuite';
import './imageMessageModalStyle.css';
import { deleteImage } from '../../../http/chatAPI';

const ImageMessageModal = ({modalOpened, handleClose, uploadedPhotos, setUploadedPhotos}) => {

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
                    <Button onClick={handleClose} appearance="primary">
                        Ok
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
