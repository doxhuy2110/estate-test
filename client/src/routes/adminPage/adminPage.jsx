import { useContext, useEffect, useState } from "react";
import "./adminPage.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Routes, Route } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import Card from "../../components/card/Card";
import NewsItem from "../../components/newsItem/newsItem";

function AdminPage() {
    const navigate = useNavigate();

    const [userList, setUserList] = useState([]);

    const checkAdmin = async () => {
        try {
            const res = await apiRequest.get("/test/should-be-admin");
            if (!res.data.isAdmin) {
                navigate("/profile");
            }
        } catch (err) {
            console.error("Error while checking admin status:", err);
            navigate("/error"); // Điều hướng đến trang lỗi nếu API thất bại
        }
    };



    const [activeTab, setActiveTab] = useState("");

    const handleUserManage = () => { setActiveTab("userManage"); fetchUserList(); };
    const handlePostManage = () => { setActiveTab("postManage"); fetchPostList(); };
    const handleNewsManage = () => { setActiveTab("newsManage"); fetchNewsList(); };


    const fetchUserList = async () => {
        try {
            const res = await apiRequest.get("/users");
            setUserList(res.data);
        } catch (err) {
            console.error("Error while fetching user list:", err);
        }
    }

    const removeUser = async (userId) => {
        try {
            if (confirm(`Xác nhận xóa tài khoản`) == true) {
                const res = await apiRequest.delete(`/users/${userId}`);
                fetchUserList();
            }
        } catch (err) {
            console.error("Error while removing user:", err);
        }
    }

    const [postList, setPostList] = useState([]);

    const fetchPostList = async () => {
        try {
            const res = await apiRequest.get("/posts");
            setPostList(res.data);
            console.log(res.data);
        }
        catch (err) {
            console.error("Error while fetching post list:", err);
        }
    };
    const handleDeletePost = async (id) => {
        try {
            if (confirm("Do you really want to delete the post?")) {
                await apiRequest.delete("/posts/" + id);
                fetchPostList();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const [newsList, setNewsList] = useState([]);
    const fetchNewsList = async () => {
        try {
            const res = await apiRequest.get("/news");
            setNewsList(res.data);
        } catch (err) {
            console.error("Error while fetching news list:", err);
        }
    };

    const handleDeleteNews = async (id) => {
        try {
            if (confirm("Do you really want to delete the news?")) {
                await apiRequest.delete("/news/" + id);
                fetchNewsList();
            }
        } catch (err) {
            console.log(err);
        }
    }



    // const removePost = async (postId) => {
    //     try {
    //         if (confirm(`Xác nhận xóa bài viết`) == true) {
    //             const res = await apiRequest.delete(`/posts/${postId}`);
    //             fetchPostList();
    //         }
    //     } catch (err) {
    //         console.error("Error while removing post:", err);
    //     }
    // };

    const getUserName = (userId) => {
        const user = userList.find(user => user.id === userId);
        return user.username;
    };

    useEffect(() => {
        checkAdmin();
        fetchUserList();
        fetchPostList();
        fetchNewsList();
    }, []);

    return (
        <div>
            <div className='admin-navbar'>
                <div className='admin-navbar-left'>
                    <h1>Admin Panel</h1>
                </div>
                {/* <img className='profile' src={assets.profile_image} alt="" /> */}
            </div>
            <hr />
            <div className="admin-page">
                <div className="sidebar">
                    <div className="sidebar-options">
                        <div
                            className={`sidebar-option ${activeTab === "userManage" ? "active" : ""}`}
                            onClick={handleUserManage}
                        >
                            <img src={"/profile_icon.png"} alt="User Manage Icon" />
                            <p>Quản lý người dùng</p>
                        </div>
                        <div
                            className={`sidebar-option ${activeTab === "postManage" ? "active" : ""}`}
                            onClick={handlePostManage}
                        >
                            <img src={"/post_icon.png"} alt="Post Manage Icon" />
                            <p>Quản lý bài viết</p>
                        </div>
                        <div
                            className={`sidebar-option ${activeTab === "newsManage" ? "active" : ""}`}
                            onClick={handleNewsManage}
                        >
                            <img src={"/news-icon.png"} alt="News Manage Icon" />
                            <p>Quản lý tin tức</p>
                        </div>
                        <div
                            className={`sidebar-option`}
                            onClick={() => navigate("/")}
                        >
                            <img src={"/back.png"} alt="News Manage Icon" />
                            <p>Trở lại</p>
                        </div>
                    </div>

                </div>
                <div className="content">
                    {activeTab === "userManage" && (
                        <div className="user-manage">
                            <h1>Quản lý người dùng</h1>
                            <div className="user-list title-list">
                                <div className="header-item"></div>
                                <div className="header-item">Username</div>
                                <div className="header-item">Email</div>
                                <div className="header-item">Date creat</div>
                                <div className="header-item">Action</div>
                            </div>
                            {userList.map((user, index) => {
                                return (
                                    !user.isAdmin && <div key={index} className="user-list">
                                        <img src={user.avatar || "noavatar.png"} alt="Avatar" className="avatar" />
                                        <div className="user-item-content">{user.username}</div>
                                        <div className="user-item-content">{user.email}</div>
                                        <div className="user-item-content">{new Date(user.createdAt).toLocaleDateString()}</div>
                                        <div className="user-item-content">
                                            <button className="btn btn-danger" onClick={() => removeUser(user.id)}>Xóa</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                    }
                    {activeTab === "postManage" && (
                        <div className="post-manage">
                            <h1>Danh sách bài viết</h1>
                            <div className="post-list">
                                {postList.map((post, index) => {
                                    return (
                                        <div className="post" key={index}>
                                            <Card item={post} />
                                            <div className="buttons">

                                                <button className="button" onClick={() => handleDeletePost(post.id)}>
                                                    <img src="/delete.png" alt="Delete" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {activeTab === "newsManage" && (
                        <div className="news-manage">
                            <h1>Danh sách tin tức</h1>
                            <div className="news-list">
                                {newsList.map((news, index) => {
                                    return (
                                        <div className="news" key={index}>
                                            <NewsItem item={news} />
                                            <div className="buttons">
                                                <button className="button" onClick={() => navigate(`/news/edit/${news.id}`)}>
                                                    <img src="/edit.png" alt="Edit" />
                                                    Edit
                                                </button>
                                                <button className="button" onClick={() => handleDeleteNews(news.id)}>
                                                    <img src="/delete.png" alt="Delete" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                    }
                </div>

            </div>
        </div>
    );
}

export default AdminPage;
