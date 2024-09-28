import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [friendsBlogs, setFriendsBlogs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [showFriendsBlogs, setShowFriendsBlogs] = useState(false);

    const fetchBlogs = async () => {
        const res = await fetch('http://localhost:8000/api/blogs');
        const result = await res.json();
        setBlogs(result.data);
    };

    const fetchFriendsBlogs = async () => {
        const res = await fetch('http://localhost:8000/api/friends', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const result = await res.json();
        setFriendsBlogs(result.data);
    };

    const searchBlogs = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8000/api/blogs?keyword=' + keyword);
        const result = await res.json();
        setBlogs(result.data);
    };

    const resetSearch = () => {
        fetchBlogs();
        setKeyword('');
    };

    useEffect(() => {
        fetchBlogs();
        fetchFriendsBlogs();
    }, []);

    return (
        <div className='container'>
            <div className="d-flex justify-content-center pt-5">
                <form onSubmit={searchBlogs}>
                    <div className='d-flex'>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className='form-control'
                            placeholder='Rechercher des blogs'
                        />
                        <button className='btn btn-dark ms-2'>Rechercher</button>
                        <button type='button' onClick={resetSearch} className='btn btn-success ms-2'>Réinitialiser</button>
                    </div>
                </form>
            </div>
            <div className="d-flex justify-content-between pt-5 mb-4">
                <h4>{showFriendsBlogs ? 'Blogs des Amis' : 'Blogs'}</h4>
                <div>
                    <button onClick={() => setShowFriendsBlogs(!showFriendsBlogs)} className='btn btn-dark'>
                        {showFriendsBlogs ? 'Afficher tous les blogs' : 'Afficher les blogs des amis'}
                    </button>
                    <a href='/create' className='btn btn-dark ms-2'>Créer</a>
                </div>
            </div>
            <div className='row'>
                {(showFriendsBlogs ? friendsBlogs : blogs).map((blog) => (
                    <BlogCard
                        blogs={showFriendsBlogs ? friendsBlogs : blogs}
                        setBlogs={showFriendsBlogs ? setFriendsBlogs : setBlogs}
                        blog={blog}
                        key={blog.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default Blogs;
