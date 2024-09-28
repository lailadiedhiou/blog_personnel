import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
    const [blog, setBlog] = useState({});
    const [comments, setComments] = useState([]);
    const params = useParams();

    const fetchBlog = async () => {
        const res = await fetch(`http://localhost:8000/api/blogs/${params.id}`);
        const result = await res.json();
        setBlog(result.data);
    }

    const fetchComments = async () => {
        const res = await fetch(`http://localhost:8000/api/blogs/${params.id}/comments`);
        const result = await res.json();
        setComments(result.data || []); // Assurez-vous que `comments` est un tableau vide si aucune donnée n'est renvoyée
    }

    useEffect(() => {
        fetchBlog();
        fetchComments();
    }, [params.id]);

    return (
        <div className='container'>
            <div className="d-flex justify-content-between pt-5 mb-4">
                <h2>{blog.title}</h2>
                <div>
                    <a href='/' className='btn btn-dark'>Retour aux Blogs</a>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <p>par <strong>{blog.author}</strong> le {blog.date}</p>
                    {blog.image && <img className='w-50' src={`http://localhost:8000/uploads/blogs/${blog.image}`} alt="Blog" />}
                    <div className='mt-5' dangerouslySetInnerHTML={{ __html: blog.description }}></div>
                </div>
            </div>
            <div className='mt-5'>
                <h4>Commentaires</h4>
                <ul className='list-group mt-4'>
                    {comments && comments.length > 0 ? ( // Vérification de la longueur du tableau
                        comments.map(comment => (
                            <li key={comment.id} className='list-group-item'>
                                {comment.user?.name} : {comment.text}
                            </li>
                        ))
                    ) : (
                        <li className='list-group-item'>Aucun commentaire pour l'instant</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default BlogDetail;
