import bcrypt from 'bcrypt';
import { Chat, User } from '../models/models.js';
import jwt from 'jsonwebtoken';

const generateJWT = (id, tag) => {

    return jwt.sign(
        { id, tag },
        process.env.SECRET_KEY,
        { expiresIn: '7d' },
    );

};

class UserController {

    async getOne(req, res, next) {

        try {

            const { tag } = req.params;

            const user = await User.findOne({ tag })
                .populate("chats friends blockedUsers");
            await user.populate("chats.latestMessage");
            await user.populate("chats.latestMessage.author");

            if (!user) throw new Error("User doesn't exist");

            user.chats.sort((a, b) => {
                const createdAtA = a.latestMessage ? a.latestMessage.createdAt : new Date(0);
                const createdAtB = b.latestMessage ? b.latestMessage.createdAt : new Date(0);
                return createdAtB - createdAtA;
            })

            const userData = { ...user._doc };
            delete userData.password;
            delete userData.token;

            return res.status(200).json(userData);

        }

        catch (error) {
            res.status(400).json(error.message);
        }
    }

    async getAll(req, res, next) {

        try {

            const { queryParam } = req.params;
            const query = {};
            if (queryParam) {
                query.$or = [
                    { name: { $regex: queryParam, $options: "i" } },
                    { tag: { $regex: queryParam, $options: "i" } }
                ];
            }

            const users = await User.find(query).find({ tag: { $ne: req.user.tag } }).limit(20).select('-phone -email -password');

            res.status(200).json(users);

        } catch (error) {

            res.status(400).json(error.message);
        }
    }

    async getAllNotInChat(req, res, next) {
        try {

            const { chatId } = req.params;

            const chat = await Chat.findById(chatId);

            if (!chat.users) throw new Error("Chat not found or doesn't have any users");

            const chatUserIds = chat.users;

            const usersNotInChat = await User.find({ _id: { $nin: chatUserIds } }).select('-phone -email -password');

            res.status(200).json({ users: usersNotInChat });

        } catch (error) {

            res.status(400).json(error.message);
        }
    }

    async getUsersInChats(req, res, next) {

        try {

            let users = []

            let { id } = req.params;

            if (!id) throw new Error("Id is missing");

            const user = await User.findById(id).populate("chats");
            await user.populate({
                path: "chats",
                populate: {
                    path: "users",
                    select: "-phone -email -password"
                }
            });

            if (user.chats) user.chats.forEach(chat => {
                if (chat.users) chat.users.forEach(user => {
                    if (!users.find(found => found._id === user._id) && user._id != id) {
                        users.push(user);
                    }
                })
            })

            res.status(200).json({ users });

        }

        catch (error) {

            res.status(400).json(error.message);

        }

    }

    async registration(req, res, next) {

        try {

            let { email, password, name, tag, phone } = req.body;

            tag = tag.toLowerCase();

            if (!tag || !email || !password || !name) throw new Error("Something is missing");

            const userExists = await User.findOne({ tag });
            const userExistsEmail = await User.findOne({ email });

            if (userExists || userExistsEmail) {
                throw new Error("User already exists");
            }

            const salt = await bcrypt.genSalt(10);
            const newPass = await bcrypt.hash(password, salt);

            const user = await User.create({
                tag,
                email,
                password: newPass,
                name,
                phone
            });

            const userData = { ...user._doc };
            delete userData.password;

            console.log('fine');

            res.status(200).json({ ...userData, token: generateJWT(user._id, user.tag) })

        }

        catch (error) {

            res.status(400).json(error.message);

        }

    }

    async login(req, res, next) {

        try {

            let { login, password } = req.body;

            login = login.toLowerCase();


            let user;

            user = await User.findOne({ tag: login }).populate("chats friends blockedUsers");
            if (!user) user = await User.findOne({ email: login }).populate("chats");
            if (!user) {
                throw new Error("Incorect login");
            }

            const checkPassword = bcrypt.compareSync(password, user.password);

            if (!checkPassword) {
                throw new Error("Incorect password");
            }

            await user.populate("chats.latestMessage");
            await user.populate("chats.latestMessage.author");

            const userData = { ...user._doc };
            delete userData.password;

            res.status(201).json({ ...userData, token: generateJWT(user._id, user.tag) })

        }

        catch (error) {

            res.status(400).json(error.message)

        }

    }

    async update(req, res, next) {

        try {

            const { email, name, tag, phone } = req.body;
            const userTag = req.params.tag;
            const userId = req.user.id;

            if (!await User.findOne({ tag: userTag })) return res.status(400).json("User doesn't exist");

            if (userTag !== req.user.tag) {
                return res.status(400).json("Authorization error");
            }

            const updateFields = {};
            if (email) updateFields.email = email;
            if (name) updateFields.name = name;
            if (tag) updateFields.tag = tag;
            if (phone) updateFields.phone = phone;

            const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(201).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                tag: updatedUser.tag,
                phone: updatedUser.phone,
                token: generateJWT(updatedUser._id, updatedUser.tag),
            })

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res, next) {

        try {

            const { password } = req.body;
            const { tag } = req.params;

            const user = await User.findOne({ tag });

            if (tag !== req.user.tag || !bcrypt.compareSync(password, user.password)) {
                return res.status(400).json("Authorization error");
            }

            const deltedUser = await User.findOneAndDelete({ tag });

            if (!deltedUser) {
                return res.status(400).json("User doesn't exist");
            }

            return res.status(201).json({
                _id: deltedUser._id,
                name: deltedUser.name,
                email: deltedUser.email,
                tag: deltedUser.tag,
                phone: deltedUser.phone,
            })
        }

        catch (error) {

            res.status(400).json(error.message)

        }
    }

    async changePassword(req, res, next) {

        try {

            const { oldPassword, newPassword, tag } = req.body;

            const user = await User.findOne({ tag });

            if (tag !== req.user.tag || !oldPassword || !newPassword) {
                return res.status(400).json("Authorization error");
            }

            if (!bcrypt.compareSync(oldPassword, user.password)) {
                return res.status(400).json("Old password is incorrect");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const changedUser = await User.findOneAndUpdate({ tag },
                { $set: { password: hashedPassword } }
            );

            return res.status(201).json({
                _id: changedUser._id,
                name: changedUser.name,
                email: changedUser.email,
                tag: changedUser.tag,
                phone: changedUser.phone,
            })
        }

        catch (error) {

            res.status(400).json(error.message);

        }
    }

    async getChats(req, res, next) {
        try {

            const { id } = req.params;

            if (id !== req.user.id || !id) {
                return res.status(400).json("Authorization error");
            }

            const chats = await Chat.find({ users: id })
                .populate({
                    path: 'users',
                    select: '-password'
                })
                .populate({
                    path: 'latestMessage',
                    populate: {
                        path: 'author',
                        select: '-password'
                    }
                });

            res.status(200).json({ chats })

        }

        catch (error) {

            res.status(400).json(error.message);

        }
    }

    async check(req, res, next) {


        try {

            const token = generateJWT(req.user.id, req.user.tag);
            return res.json({ token });

        } catch (error) {
            res.status(400).json(error.message);
        }

    }

};

export default new UserController()