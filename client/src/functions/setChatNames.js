export default function (chats, user) {

    console.log(chats, user);

    const newChats = chats.map(chat => {

        if (!chat.isGroup) {
            const foundUser = chat?.users.find(u => u._id !== user._id);
            return { ...chat, name: foundUser.name, displayPicture: foundUser.image }
        }

        return chat;

    })

    return newChats;

}