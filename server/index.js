import express from 'express';
import cors from 'cors';
import router from './src/router/router.js';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { Message } from './src/models/models.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('static/uploads'))
app.use('/default', express.static('static/default'))
app.use('/api', router);

const start = async () => {
    try {
        
        const server = app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
        await mongoose.connect(process.env.MONGODB_URI);
        
        const io = new Server(server, {
            cors: {
                origin: process.env.CLIENT,
                methods: ["GET", "POST", "PUT", "DELETE"]
            }
        });
        io.on('connection', (socket) => {
            console.log("user connected");

            socket.on('setup', (userData) => {
                socket.join(userData._id);
                console.log(userData._id);
                socket.emit('connected');
            });
            socket.on('join chat', (room) => {
                socket.join(room);
                console.log('User Joined room ' + room.name);
            });
            socket.on('new message', async (newMessageRecieved) => {
                let chat = newMessageRecieved.chat;
                if(!chat.users) return console.log("Chat doesn't have any users");
                chat.users.forEach(user => {
                    
                    console.log(user);
                    if(user._id === newMessageRecieved.sender._id) return;

                    socket.in(user._id).emit("message recieved", newMessageRecieved);
                })
            })
        })

    } 

    catch (error) { 
        console.log(error);
    }
};

start();