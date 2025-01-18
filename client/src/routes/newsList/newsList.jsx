import React, { Suspense } from 'react'
import "./newsList.css";
import NewsItem from '../../components/newsItem/newsItem';
import { Await, useLoaderData } from 'react-router-dom';
const NewsList = () => {
    const data = useLoaderData();
    return (
        <div className='newsList-container'>
            <h1>Discover the latest real estate news</h1>
            <div className='search-sort-container'>
                <div className='search'>
                    <input type="text" placeholder="Search news" />
                    <button>Search</button>
                </div>
                <div className='sort'>
                    <h3>Sort by</h3>
                    <select name="category" id="category">
                        <option value="Newest">Newest </option>
                        <option value="Popular">Popular</option>
                        <option value="Trending">Trending</option>
                    </select>
                </div>
            </div>
            <div className='newsList'>
                <Suspense fallback={<p>Loading...</p>}>
                    <Await
                        resolve={data}
                        errorElement={<p>Error loading posts!</p>}
                    >
                        {data.map((post) => (
                            <div className='newsList-item'>
                                <NewsItem key={post.id} item={post} />
                            </div>
                        ))
                        }
                    </Await>
                </Suspense>
            </div>
        </div >
    )
}

export default NewsList
