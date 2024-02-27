import jwt from 'jsonwebtoken'
import { Chat } from '../models/models.js';

export default async function(req, res, next) {
    if(req.method === "OPTIONS") {
        next();
    }

    try {

        const token = req.headers.authorization.split(' ')[1];
        const {chatId} = req.params;
        
        if(!token) {
            return res.status(401).json({message: "Not authorised"})
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const chat = await Chat.findById(chatId);

        if(chat.groupAdmin != decoded.id) {
            return res.status(401).json({message: "You are not chat admin"});
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({message: "Not authorised"})
    }
}