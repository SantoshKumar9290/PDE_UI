import axios from 'axios';
const instance = axios.create({
    baseURL: process.env.BACKEND_URL+"/pdeapi/v1" 
});

export default instance;