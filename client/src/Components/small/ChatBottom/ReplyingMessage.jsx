import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import './replyingMessage.css'
import cross from '../../../images/cross.svg'

const ReplyingMessage = observer(() => {

    const { app } = useContext(Context);

    return (
        <>
            {app.replyingTo?.text ? (
                <div className='replying-message'>
                    <div className='replyingTo'>
                        <b>Replying to {app.replyingTo.author.name}</b>
                        <p className='replyingTo-text'>{app.replyingTo.text}</p>
                    </div>
                    <img onClick={() => app.resetReplyingTo()} height="24px" src={cross} alt='cross'></img>
                </div>
            ) : null}
        </>
    );
});

export default ReplyingMessage;
