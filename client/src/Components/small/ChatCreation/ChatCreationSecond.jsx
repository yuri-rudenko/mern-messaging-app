import React, { useContext, useState } from 'react';
import { Modal, Button, Uploader } from 'rsuite';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import { deleteImage } from '../../../http/chatAPI';
import { Context } from '../../..';

const ChatCreationSecond = () => {

    const {app} = useContext(Context);

    return (
        <div>
            <Modal open={app.secondChatCreationOpened}>
                <Modal.Header>
                    <Modal.Title>Choose users</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button size="lg" appearance="primary">
                            Submit
                        </Button>
                        <Button size="lg" appearance="ghost">
                            Cancel
                        </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChatCreationSecond;
