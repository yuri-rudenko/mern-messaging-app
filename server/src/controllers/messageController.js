import { Chat, Message, User } from "../models/models.js";


class messageController {

    async create(req, res, next) {

        try {

            const {content, tag, chatId} = req.body;

            const chat = await Chat.findById(chatId);
            const user = await User.findOne({tag});

            console.log(chat.users, user.tag)

            if(!content || !chat || !user) throw new Error("Data error");

            if(tag !== req.user.tag) throw new Error("Authorization error");

            const message = await Message.create({
                author: user._id,
                type: content.type,
                chatId: chatId,
                text: content.text
            });

            if(message) await Chat.findByIdAndUpdate(chatId, {
                $push: { messages: message._id },
                $set: {latestMessage: message._id}
            });

            return res.status(200).json({message});
            
        } 

        catch (error) {
            res.status(400).json(error.message);
        }
    }
}

export default new messageController()