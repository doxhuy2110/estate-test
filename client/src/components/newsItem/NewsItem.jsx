import React from 'react'
import "./NewsItem.css";
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import DOMPurify from "dompurify";
import apiRequest from '../../lib/apiRequest';

const NewsItem = ({ item }) => {

  const handleClick = async () => {
    try {
      await apiRequest.put(`/news/incrementViews/${item.id}`); 
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };


  return (
    <div className='newsItem'>
      <Link to={`/news/${item.id}`} onClick={handleClick}>
        <img src={item.image} alt="" />
      </Link>
      <div className='info'>
        <Link to={`/news/${item.id}`} onClick={handleClick}>
          <h3>{item.title}</h3>
        </Link>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.desc),
          }}
        />
        <span>{format(item.createdAt) }</span>
      </div>

    </div>
  )
}

export default NewsItem
