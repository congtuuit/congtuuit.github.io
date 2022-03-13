
import axios from "axios";
import { message } from 'antd';

const http = axios.create({
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Token KHCfyyqpNlh0sDWncNKgrc0ulX1rDnm0',
        'Content-Type': 'application/json'
    },
    timeout: 300000,
});

http.interceptors.request.use(async (config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});


http.interceptors.response.use(async (response) => {
    console.log('>>', response)
    return response.data;
}, (error) => {
    console.log('error >>', error?.response);
    const errorMessage = error?.response?.data?.message;
    if (errorMessage) {
        message.error(errorMessage);
    }
    return Promise.reject(error?.response);
})

export default http;