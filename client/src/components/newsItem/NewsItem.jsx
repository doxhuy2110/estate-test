import React from 'react'
import "./NewsItem.css";
import { Link } from 'react-router-dom';
const NewsItem = ({ item }) => {
  return (
    <div className='newsItem'>
      <Link to={`/news/${item.id}`}>
        <img src={item.image} alt="" />
      </Link>
      <div className='info'>
        <Link to={`/news/${item.id}`}>
          <h3>{item.title}</h3>
        </Link>
        <p>{item.desc}</p>
        <span>2h trước</span>
      </div>

    </div>
  )
}

export default NewsItem
