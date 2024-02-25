import bcrypt from 'bcrypt';
import { User } from '../models/models.js';
import jwt from 'jsonwebtoken';

const generateJWT = (id, email, role) => {

    return jwt.sign(
        {id: id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'},
    );
    
};

class UserController {

    async registration(req, res, next) {

        try {
            
            const {email, password, name, tag, phone} = req.body;

            if(!tag || !email || !password || !name) throw new Error("Something is missing");

            const userExists = await  User.findOne({tag});

            if(userExists) {
                throw new Error("User already exists");
            }

            const user = await User.create({
                tag,
                email,
                password,
                name,
                phone
            })

            if(user) {
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    tag: user.tag,
                    password: user.password,
                    phone: user.phone
                })
            }

        } 

        catch (error) {

            res.status(400).json(error.message)
            
        }

        

    }

    async login(req, res, next) {

        try {
            
            const {email, password, name, tag, phone} = req.body;


        } 

        catch (error) {

            res.status(400).json(error.message)

        }

    }

};

export default new UserController()