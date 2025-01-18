import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://estate-eahn340qf-doxhuy2104s-projects.vercel.app/api",
    withCredentials: true,
});

export default apiRequest;