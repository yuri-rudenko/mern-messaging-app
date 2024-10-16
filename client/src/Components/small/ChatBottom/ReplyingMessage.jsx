import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import './replyingMessage.css'
import cross from '../../../images/cross.svg'

const ReplyingMessage = observer(() => {

    const { app } = useContext(Context);

    return (
        <>
            {app.replyingTo?.text || app.replyingTo?.files  ? (
                <div className='replying-message'>
                    <div className='replyingTo'>
                        <b>Replying to {app.replyingTo.author.name}</b>
                        <div className="replyingTo-message-content">

                            {app.replyingTo.type == "Image" && <img className='replyingTo-image' src={process.env.REACT_APP_API_URL + '/'+ app.replyingTo?.files[0].src}></img>}
                            <p className='replyingTo-text'>{app.replyingTo.text}</p>

                        </div>
                    </div>
                    <img onClick={() => app.resetReplyingTo()} height="24px" src={cross} alt='cross'></img>
                </div>
            ) : null}
        </>
    );
});

export default ReplyingMessage;
