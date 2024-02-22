import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    tag: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], trim: true, lowercase: true},
    phone: { type: String, unique: true, match: /^[0-9]{10}$/ },
    password: {type: String, required: true, min: [6, 'Password is too short'], max: [16, 'Password is too long']},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    chats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}],
    image: {type: String},
    status: {type: String},
    isOnline: {type: Boolean, default: false},
    lastSeenOnline: {type: Date, default: Date.now()},
    isPhonePrivate: {type: Boolean, default: false},
    blockedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
    name: {type: String},
    displayPicture: {type: String},
    isGroup: {type: Boolean, default: false},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    images: [{type: String}],
    documents: [{type: String}],
    links: [{type: String}],
}, { timestamps: true })

const MessageSchema = new mongoose.Schema({
    author: {type: String, required: [true, 'Message must have an author']},
    type: {type: String, enum: ['Text', 'Image', 'File']},
    file: {type: String},
    status: {type: String, default: 'sending'},
    chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
    text: {type: String},
    readBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    responseTo: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
}, { timestamps: true })

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);
const Message = mongoose.model('Message',MessageSchema);

export {
    User,
    Chat,
    Message
};