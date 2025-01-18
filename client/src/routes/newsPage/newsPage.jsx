import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import './newsPage.css'; // Nhập tệp CSS
import DOMPurify from "dompurify";
import apiRequest from '../../lib/apiRequest';


const NewsPage = () => {
  const news = useLoaderData(); // Lấy dữ liệu bài viết từ loader
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDelete = async () => {
    try {
      if (confirm("Do you really want to delete this news?")) {
        await apiRequest.delete("/news/" + news.id);
        navigate("/news");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const checkAdmin = async () => {
    try {
      const res = await apiRequest.get("/test/should-be-admin");
      if (res.data.isAdmin) {
        setIsAdmin(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    <div className="news-container">
      {/* Hiển thị tiêu đề bài viết */}
      <h1 className="news-title">{news.title}</h1>

      {/* Hiển thị nội dung bài viết */}
      <div
        className="news-content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(news.content),
        }} />
      {isAdmin &&
        (
          <div className="admin-buttons">

            <Link to={`/news/edit/${news.id}`}>
              <button className="admin-button">
                <img src='/edit.png' alt='edit' />
                Edit
              </button>
            </Link>
            <button onClick={handleDelete} className="admin-button">
              <img src='/delete.png' alt='delete' />
              Delete
            </button>
          </div>
        )}
    </div>
  );
};

export default NewsPage;
