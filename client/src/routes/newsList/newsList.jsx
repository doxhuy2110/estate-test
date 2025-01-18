import React, { Suspense } from 'react';
import "./newsList.css";
import NewsItem from '../../components/newsItem/newsItem';
import { Await, useLoaderData, useNavigate, useLocation } from 'react-router-dom';

const NewsList = () => {
    const data = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();

    // Xử lý thay đổi sắp xếp
    const handleSortChange = (e) => {
        const selectedSort = e.target.value;

        // Cập nhật URL để phản ánh tiêu chí sắp xếp
        const params = new URLSearchParams(location.search);
        params.set('sort', selectedSort);
        navigate(`${location.pathname}?${params.toString()}`); // Điều hướng đến URL mới
    };

    return (
        <div className='newsList-container'>
            <h1>Discover the latest real estate news</h1>
            <div className='search-sort-container'>
                <div className='sort'>
                    <h3>Sort by</h3>
                    <select name="category" id="category" onChange={handleSortChange}>
                        <option value="Newest">Newest</option>
                        <option value="Popular">Popular</option>
                        <option value="Oldest">Oldest</option>
                    </select>
                </div>
            </div>
            <div className='newsList'>
                <Suspense fallback={<p>Loading...</p>}>
                    <Await
                        resolve={data.newsRespone}
                        errorElement={<p>Error loading posts!</p>}
                    >
                        {(newsRespone) =>
                            newsRespone.data.map((news) => (
                                <NewsItem key={news.id} item={news} />
                            ))
                        }
                    </Await>
                </Suspense>
            </div>
        </div>
    );
};

export default NewsList;
