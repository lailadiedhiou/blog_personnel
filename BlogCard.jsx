import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BlogCard = ({ blog, blogs, setBlogs }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour afficher l'image du blog
    const showImage = (img) => {
        return img ? `http://localhost:8000/uploads/blogs/${img}` : 'https://placehold.co/600x400';
    };

    // Fonction pour supprimer un blog
    const deleteBlog = async (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            try {
                const res = await fetch(`http://localhost:8000/api/blogs/${id}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    const newBlogs = blogs.filter((b) => b.id !== id);
                    setBlogs(newBlogs);
                    toast.success("Blog deleted successfully.");
                } else {
                    toast.error("Failed to delete blog.");
                }
            } catch (error) {
                toast.error("Error deleting blog.");
            }
        }
    };

    // Fonction pour récupérer les commentaires
    const fetchComments = async () => {
        if (!blog || !blog.id) {
            setError("Blog ID is not defined.");
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8000/api/blogs/${blog.id}/comments`);
            const result = await res.json();
            console.log(result); // Debugging: voir les données reçues

            if (Array.isArray(result.comment)) {
                setComments(result.comment);
                // Sauvegarder les commentaires dans localStorage
                localStorage.setItem(`comments_blog_${blog.id}`, JSON.stringify(result.comment));
            } else {
                setComments([]);  // Initialise à un tableau vide si aucun commentaire n'est trouvé
                localStorage.setItem(`comments_blog_${blog.id}`, JSON.stringify([]));
            }
            setLoading(false);
        } catch (error) {
            setError("Failed to load comments.");
            setLoading(false);
        }
    };

    // Fonction pour soumettre un commentaire
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/api/blogs/${blog.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: newComment }) // Assurez-vous que le champ est 'content'
            });

            if (res.ok) {
                const result = await res.json();
                const updatedComments = [...comments, result.comment];
                setComments(updatedComments);
                // Mettre à jour les commentaires dans localStorage
                localStorage.setItem(`comments_blog_${blog.id}`, JSON.stringify(updatedComments));
                setNewComment('');
                toast.success("Comment added successfully.");
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to add comment.");
            }
        } catch (error) {
            toast.error("Error adding comment.");
        }
    };

    // Fonction pour afficher ou masquer les commentaires
    const toggleComments = () => {
        setShowComments(!showComments);
        if (!showComments && comments.length === 0) {
            fetchComments(); // Charger uniquement si on n'a pas encore chargé les commentaires
        }
    };

    useEffect(() => {
        // Charger les commentaires depuis localStorage lors du chargement du composant
        const savedComments = localStorage.getItem(`comments_blog_${blog.id}`);
        if (savedComments) {
            setComments(JSON.parse(savedComments));
        } else {
            fetchComments();
        }
    }, [blog.id]);

    return (
        <div className='col-12 col-md-6 col-lg-3 mb-4'>
            <div className='card border-0 shadow-lg'>
                <img src={showImage(blog.image)} className='card-img-top' alt="Blog" />
                <div className='card-body'>
                    <h2 className='h5'>{blog.title}</h2>
                    <p>{blog.shortDesc}</p>
                    <div className='d-flex justify-content-between'>
                        <a href={`/blog/${blog.id}`} className='btn btn-dark'>Details</a>
                        <div>
                            <a href='#' className='text-danger' onClick={() => deleteBlog(blog.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </a>
                            <a href={`/blog/edit/${blog.id}`} className='text-dark ms-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <h5>Comments</h5>
                        <button onClick={toggleComments} className="btn btn-secondary mb-3">
                            {showComments ? 'Hide Comments' : 'Show Comments'}
                        </button>

                        {showComments && (
                            <>
                                <form onSubmit={handleCommentSubmit}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="form-control"
                                            placeholder="Add a comment"
                                        />
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>
                                {loading && <p>Loading comments...</p>}
                                {error && <p className="text-danger">{error}</p>}
                                <ul className="list-unstyled">
                                    {comments.map((comment) => (
                                        <li key={comment.id} className="border-bottom mb-2 pb-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0">{comment.user ? comment.user.name : 'Unknown'}</h6>
                                                <p className="mb-0">{comment.content}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
