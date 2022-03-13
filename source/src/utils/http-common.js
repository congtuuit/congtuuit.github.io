
import axios from "axios";
import { message } from 'antd';

const http = axios.create({
    baseURL: process.env.REACT_APP_API,
    withCredentials: true,
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    timeout: 300000,
});

http.interceptors.request.use(async (config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});


http.interceptors.response.use(async (response) => {
    console.log('>>', response)
    return response;
}, (error) => {
    console.log('error >>', error?.response);
    const errorMessage = error?.response?.data?.message;
    if (errorMessage) {
        message.error(errorMessage);
    }
    return Promise.reject(error?.response);
})

export default http;