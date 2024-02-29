import { $authHost, $host } from "./indexAPI.js";
import { jwtDecode } from "jwt-decode";

export const registration = async (values) => {
    try {
        const {data} = await $host.post('/api/user/registration', values);
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (error) {
        return(error.response);
    }

}

export const login = async (values) => {
    try {
        const {data} = await $host.post('/api/user/login', values);
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (error) {
        return(error.response);
    }
}

export const check = async () => {
    try {
        const {data} = await $authHost.get('/api/user/auth');
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (error) {
        return(error.response);
    }
    
}