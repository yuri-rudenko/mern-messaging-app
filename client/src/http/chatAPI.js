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
        const {data} = await $authHost.delete('/api/deleteImage', {data: { image }});
        return data;
    } catch (error) {
        return(error.response);
    }
}