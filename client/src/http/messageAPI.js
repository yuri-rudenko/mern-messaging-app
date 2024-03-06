import { $authHost, $host } from "./indexAPI.js";
import { jwtDecode } from "jwt-decode";

export const sendMessage = async (values) => {
    try {
        const {data} = await $authHost.post('/api/message/', values);
        return data;
    } catch (error) {
        return(error.response);
    }

}