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
app.use(express.static('static/uploads'));
app.use('/default', express.static('static/default'));
app.use('/api', router);
app.use((err, req, res, next) => {
    console.error(err);

    if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ message: err.message });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

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

            socket.on('setup', (userData) => {
                socket.join(userData._id);
                socket.emit('connected');
            });
            socket.on('join chat', (room) => {
                socket.join(room);
            });
            socket.on('new message', async (newMessageRecieved) => {

                let chat = newMessageRecieved.chat;
                if (!chat.users) return console.log("Chat doesn't have any users");
                chat.users.forEach(user => {

                    if (user._id === newMessageRecieved.sender._id) return;

                    socket.in(user._id).emit("message recieved", newMessageRecieved);
                })
            })
            socket.on("add to chat", ({chat, usersToAdd}) => {

                console.log("added to chat called");
                console.log(chat, usersToAdd.map(user => user.name));

                const userIds = usersToAdd.map(user => user._id);

                userIds.forEach(id => {
                    console.log();
                    socket.in(id).emit("added to chat", chat);
                })

            })
        })

    }

    catch (error) {
        console.log(error);
    }
};

start();