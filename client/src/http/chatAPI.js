import { $authHost, $host } from "./indexAPI.js";
import { jwtDecode } from "jwt-decode";

export const getChat = async (chatId) => {
    try {
        const {data} = await $host.get('/api/chat/' + chatId);
        return data;
    } catch (error) {
        return(error.response);
    }

}

export const deleteImage = async (image) => {
    try {
        console.log(image)
        const {data} = await $authHost.delete('/api/files/deleteImage', {data: { image }});
        return data;
    } catch (error) {
        return(error.response);
    }
}

export const createChat = async (name, image, users, isGroup) => {
    try {
        const {data} = await $authHost.post('/api/chat', { name, users, image, isGroup });
        return data;
    } catch (error) {
        return(error.response);
    }
}

export const addUsers = async (users, chatId) => {
    try {
        const {data} = await $authHost.put('/api/chat/users/add?chatId=' + chatId, { users, chatId });
        return data;
    } catch (error) {
        return(error.response);
    }
}