import React, { useState, useEffect } from 'react';
import { Notification, useToaster, ButtonToolbar, Button } from 'rsuite';
import 'rsuite/Notification/styles/index.css';

const NotificationModal = ({ type, text, buttons }) => {

    const toaster = useToaster();

    if (!buttons) buttons = false;

    const data = {
        info: "Information!",
        success: "Success!",
        warning: "Warning!",
        error: "Error!"
    }

    if (!data[type]) type = "info";


    useEffect(() => {
        const handleOutsideClick = (event) => {
            toaster.clear();    
        };

        document.body.addEventListener('click', handleOutsideClick);

        return () => {
            document.body.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <Notification type={type} header={data[type]} closable>
            <p>{text}</p>
            <hr />
            {buttons && <ButtonToolbar>
                <Button appearance="primary">Ok</Button>
                <Button appearance="default">Cancel</Button>
            </ButtonToolbar>}
        </Notification>
    );
};

export default NotificationModal;
