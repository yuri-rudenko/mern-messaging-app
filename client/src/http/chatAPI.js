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