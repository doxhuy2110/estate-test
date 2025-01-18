import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://estate-app-w2y3.onrender.com/api",
    withCredentials: true,
});

export default apiRequest;