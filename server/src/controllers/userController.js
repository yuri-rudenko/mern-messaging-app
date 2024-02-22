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

        const {email, password, name, tag, phone} = req.body;

    }

};

export default new UserController()