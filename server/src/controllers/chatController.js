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

            const chat = await Chat.findById(chatId).populate({
                path: 'users',
                select: '-password'
            })
            .populate({
                path: 'messages',
                populate: {
                    path: 'author',
                    select: '-password'
                }
            })
            
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
    
            const chats = await Chat.find(query)
            .populate("latestMessage")
            .populate("latestMessage.author")
            .sort({ "latestMessage.createdAt": -1 });
    
            res.status(200).json(chats);
            
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    async create(req, res, next) {

        try {

            const {name, users, image, isGroup} = req.body;

            console.log(name, users, image, isGroup);

            users.forEach(tag => {
                if(tag === req.user.tag) throw new Error("One of users you are adding is you");
            })

            users.push(req.user.tag);

            if(!name || !users) throw new Error("Params error");
 
            const ids = await tagsToIds(users);
            
            const chat = await Chat.create({
                name, users: ids, groupAdmin: req.user.id, isGroup, displayPicture: image 
            })

            ids.forEach(async (id) => {
                const user = await User.findByIdAndUpdate(id, {
                    $push: { chats: chat._id }
                })
            })

            const populatedChat = await Chat.findById(chat._id).populate('users');

            res.status(200).json({data: populatedChat});
            
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
                return res.status(400).json(`User ${tag} is already in the chat`);
            }
        
            
            const chat = await Chat.findByIdAndUpdate(id, {
                $push: { users: userId }
            });

            const user = await User.findByIdAndUpdate(userId[0], {
                $push: { chats: chat._id }
            });

            if(!chat || !user) return res.status(400).json({ error: `Chat or user didn't add` });
    
            res.status(200).json({ message: `User ${tag} added to chat ${chat.name}` });

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
                throw new Error(`User ${tag} is already not in the chat`);
            }
        
            
            const chat = await Chat.findByIdAndUpdate(id, {
                $pullAll: { users: userId }
            }, { new: true });

            const user = await User.findByIdAndUpdate(userId[0], {
                $pull: { chats: chat._id }
            });
    
            res.status(200).json({ message: `User ${tag} has been removed from chat ${chat.name}`});

        }

        catch (error) {
            res.status(400).json(error.message);
        }
    }

    async leaveChat(req, res, next) {

        try {
            const { id, chatId } = req.body;
    
            if (!id || !chatId) {
                throw new Error("Params error: Missing ID or Chat");
            }

            const userId = await User.findById(id);

            const checkedChat = await Chat.findById(chatId);
            if (!checkedChat) {
                throw new Error("Chat not found");
            }
        
            if (!checkedChat.users.includes(...id)) {
                throw new Error(`You are already not in the chat`);
            }
        
            const chat = await Chat.findByIdAndUpdate(id, {
                $pullAll: { users: userId }
            }, { new: true });

            const user = await User.findByIdAndUpdate(userId[0], {
                $pull: { chats: chat._id }
            });
    
            res.status(200).json({ message: `User ${tag} has been removed from chat ${chat.name}`});

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

            if (!chat) {
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

    async uploadChatPfp(req, res, next) {
        
        req.fileCheckResult 
        ? res.status(200).json({img: req.newFileName})
        : res.status(400).json({message: "File type error"});

    }

}

export default new chatController()