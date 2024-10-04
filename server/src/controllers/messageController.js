import { Chat, Message, User } from "../models/models.js";


class messageController {

    async create(req, res, next) {

        try {

            const {content, id, chatId, responseTo} = req.body;

            const chat = await Chat.findById(chatId);
            const user = await User.findById(id);

            ////////// add check if user is in the chat

            if(!content || !chat || !user) throw new Error("Data error");

            if(id !== req.user.id) throw new Error("Authorization error");

            console.log(responseTo)

            const message = await Message.create({
                author: user._id,
                type: content.type,
                chatId: chatId,
                text: content.text,
                files: content.files, 
                responseTo,
            });

            await message.populate("author responseTo");;
            await message.populate("responseTo.author");

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