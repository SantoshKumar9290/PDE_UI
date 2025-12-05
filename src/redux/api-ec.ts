import axios from "axios";

const instance = axios.create({
  baseURL: process.env.EC_API_URL + "/ecSearchAPI/v1",
});

export default instance;
