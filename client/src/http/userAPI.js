import { $authHost, $host } from "./indexAPI.js";
import { jwtDecode } from "jwt-decode";

export const registration = async (values) => {
    try {
        const {data} = await $host.post('/api/user/registration', values);
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        return(error.response);
    }

}

export const login = async (values) => {
    try {
        const {data} = await $host.post('/api/user/login', values);
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        return(error.response);
    }
}

export const check = async () => {
    try {
        if(!localStorage.getItem('token')) return {message: "Not Authorised"};
        const {data} = await $authHost.get('/api/user/auth');
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (error) {
        return(error.response);
    }
    
}

export const getUser = async (tag) => {
    try {
        if(!tag) return {message: "Not Authorised", status: 400};
        const {data} = await $authHost.get(`/api/user/getOne/${tag}`);

        return data;
    } catch (error) {
        return(error.response);
    }
    
}

export const getUsersInChats = async (userId) => {
    try {
        const {data} = await $authHost.get('/api/user/usersInChats/' + userId);
        return data;
    } catch (error) {
        return(error.response);
    }

}