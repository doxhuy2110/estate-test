import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://estate-test.onrender.com/api",
    withCredentials: true,
});

export default apiRequest;