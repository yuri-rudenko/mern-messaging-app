import bcrypt from 'bcrypt';
import { User } from '../models/models.js';
import jwt from 'jsonwebtoken';

const generateJWT = (id) => {

    return jwt.sign(
        {id}, 
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
                    token: generateJWT(user._id),
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
                token: generateJWT(user._id),
            })

        } 

        catch (error) {

            res.status(400).json(error.message)

        }

    }

};

export default new UserController()