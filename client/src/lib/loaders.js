import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
    const res = await apiRequest("/posts/" + params.id);
    return res.data;
};

export const newsPageLoader = async ({ request, params }) => {
    const res = await apiRequest.get("/news/" + params.id);
    return res.data;
};
export const listPageLoader = async ({ request, params }) => {
    console.log(request);
    const query = request.url.split("?")[1];
    const postPromise = apiRequest("/posts?" + query);
    return defer({
        postResponse: postPromise,
    });
};


export const newsListLoader = async ({ request }) => {
    const url = new URL(request.url);
    const sort = url.searchParams.get('sort') || 'Newest'; // Lấy tham số `sort`, mặc định là 'Newest'

    const newsPromise = apiRequest(`/news?sort=${sort}`); // Gọi API với tham số sắp xếp
    return defer({
        newsRespone: newsPromise,
    });
};


export const profilePageLoader = async () => {
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats");
    return defer({
        postResponse: postPromise,
        chatResponse: chatPromise,
    });
};


// export const updatePostLoader = async ({ request, params }) => {
//     const res = await apiRequest("/posts/" + params.id);
//     return res.data;
// };
