import bcrypt from 'bcrypt';
import { User } from '../models/models.js';
import jwt from 'jsonwebtoken';

const generateJWT = (id, tag) => {

    return jwt.sign(
        {id, tag}, 
        process.env.SECRET_KEY,
        {expiresIn: '7d'},
    );
    
};

class UserController {

    async registration(req, res, next) {

        try {
            
            const {email, password, name, tag, phone} = req.body;

            if(!tag || !email || !password || !name) throw new Error("Something is missing");

            const userExists = await User.findOne({tag});

            if(userExists) {
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

            if(user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    tag: user.tag,
                    password: user.password,
                    phone: user.phone,
                    token: generateJWT(user._id, user.tag),
                })
            }

        } 

        catch (error) {

            res.status(400).json(error.message)
            
        }

    }

    async login(req, res, next) {

        try {
            
            const {login, password} = req.body;

            let user;

            user = await User.findOne({tag: login});
            if(!user) user = await User.findOne({email: login});
            if(!user) {
                throw new Error("Incorect login");
            }

            const checkPassword = bcrypt.compareSync(password, user.password);

            if(!checkPassword) {
                throw new Error("Incorect password");
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                tag: user.tag,
                password: user.password,
                phone: user.phone,
                token: generateJWT(user._id, user.tag),
            })

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
            
            if(!await User.findOne({tag: userTag})) return res.status(400).json("User doesn't exist");

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
                password: updatedUser.password,
                phone: updatedUser.phone,
                token: generateJWT(updatedUser._id, updatedUser.tag),
            })

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res, next) {

        try {
            
            const {email, name, tag, phone} = req.body;

            const userExists = await User.findOne({tag});

            if(userExists) {
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

            if(user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    tag: user.tag,
                    password: user.password,
                    phone: user.phone,
                    token: generateJWT(user._id, user.tag),
                })
            }

        } 

        catch (error) {

            res.status(400).json(error.message)
            
        }
    }
};

export default new UserController()