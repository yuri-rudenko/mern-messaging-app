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

    async getOne(req, res, next) {

        try {

            const {chatId} = req.params;

            const chat = await Chat.findById(chatId);

            if(!chat) throw new Error("Chat doesn't exist");

            return res.status(200).json({chat});
            
        } 

        catch (error) {
            res.status(400).json(error.message);
        }
    }

    async getAll(req, res, next) {
        try {
            const { name } = req.query;
    
            const query = {};
            if (name) {
                query.name = { $regex: name, $options: "i" };
            }
    
            const chats = await Chat.find(query);
    
            res.status(200).json(chats);
            
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    async create(req, res, next) {

        try {

            const {name, users} = req.body;
            console.log(users);
            users.push(req.user.tag);
            console.log(users);

            if(!name || !users) throw new Error("Params error");

            const ids = await tagsToIds(users);
            
            const chat = await Chat.create({
                name, users: ids, groupAdmin: req.user.id, isGroup: (users.length > 1)
            }).populate('users');

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

    async removeUser(req, res, next) {

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
        
            if (!checkedChat.users.includes(...userId)) {
                return res.status(400).json({ error: `User ${tag} is already not in the chat` });
            }
        
            
            const chat = await Chat.findByIdAndUpdate(id, {
                $pullAll: { users: userId }
            }, { new: true });
    
            res.status(200).json({ message: `User ${tag} has been removed from chat ${id}`});

        }

        catch (error) {
            res.status(400).json(error.message);
        }
    }

    async changeName(req, res, next) {

        try {
            const { name } = req.body;
            const id = req.params.chatId;
    
            if (!id || !name) {
                throw new Error("Params error");
            }
        
            const chat = await Chat.findByIdAndUpdate(id, {
                $set: { name: name }
            }, { new: true });

            if (!checkedChat) {
                throw new Error("Chat not found");
            }
    
            res.status(200).json({chat});

        }

        catch (error) {
            res.status(400).json(error.message);
        }
    }

    async delete(req, res, next) {

        try {
            
            const {chatId} = req.params;

            const chat = await Chat.findByIdAndDelete(chatId);

            if(!chat) {
                return res.status(400).json("Chat doesn't exist");
            }

            return res.status(201).json(chat)
        } 

        catch (error) {

            res.status(400).json(error.message)
            
        }
    }

}

export default new chatController()