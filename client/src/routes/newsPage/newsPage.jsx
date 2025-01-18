import React from 'react';
import { useLoaderData } from 'react-router-dom';
import './NewsPage.css'; // Nhập tệp CSS

const NewsPage = () => {
  const news = useLoaderData();

  return (
    <div className="news-container"> {/* Áp dụng class cho khung chứa */}
      <h1 className="news-title">{news.title}</h1> {/* Áp dụng class cho tiêu đề */}
      {news.paragraphs.map((paragraph, index) => (
        <div key={index}>
          <p className="news-paragraph">{paragraph.text}</p> {/* Áp dụng class cho đoạn văn */}
          {paragraph.image && (
            <img className="news-image" src={paragraph.image} alt={news.title} /> // Áp dụng class cho hình ảnh
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsPage;
