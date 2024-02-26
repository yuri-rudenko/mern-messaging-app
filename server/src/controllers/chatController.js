import { Chat, User } from "../models/models.js";

async function tagsToIds(tags) {
    const ids = [];
    for (const tag of tags) {
        const user = await User.findOne({ tag });
        if (user) {
            ids.push(user._id);
        }
    }
    return ids;
}
class chatController {

    async create(req, res, next) {

        try {

            const {name, users, isGroup} = req.body;
            console.log(users);
            users.push(req.user.tag);
            console.log(users);

            if(!name || !users) throw new Error("Params error");

            const ids = await tagsToIds(users);
            
            const chat = await Chat.create({
                name, users: ids, groupAdmin: req.user.id, isGroup
            })

            res.status(200).json({chat});
            
        } 

        catch (error) {
            res.status(400).json(error.message);
        }
    }
    
    async addUser(req, res, next) {

        try {
            const { tag } = req.body;
            const id = req.params.chatId;
    
            if (!id || !tag) {
                throw new Error("Params error: Missing ID or tag");
            }

            const userId = await tagsToIds([tag])

            const checkedChat = await Chat.findById(id);
            if (!checkedChat) {
                throw new Error("Chat not found");
            }
        
            if (checkedChat.users.includes(...userId)) {
                return res.status(400).json({ error: `User ${tag} is already in the chat` });
            }
        
            
            const chat = await Chat.findByIdAndUpdate(id, {
                $push: { users: userId }
            });
    
            res.status(200).json({ message: `User ${tag} added to chat ${id}` });

        }

        catch (error) {
            res.status(400).json(error.message);
        }
    }
}

export default new chatController()