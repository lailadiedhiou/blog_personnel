import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CommentBlog = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    // Fonction pour récupérer les commentaires d'un blog
    const fetchComments = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/blogs/${blogId}/comments`);
            const data = await res.json();
            setComments(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors de la récupération des commentaires");
            setLoading(false);
        }
    };

    // Fonction pour gérer la soumission d'un nouveau commentaire
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:8000/api/blogs/${blogId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // S'assurer que le token est envoyé
                },
                body: JSON.stringify({ text: newComment }),
            });

            if (res.ok) {
                const newCommentData = await res.json();
                setComments([...comments, newCommentData.comment]); // Ajout du commentaire dans la liste
                setNewComment(''); // Réinitialisation du champ de texte
                toast.success("Commentaire ajouté avec succès");
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Erreur lors de l'ajout du commentaire");
            }
        } catch (error) {
            toast.error("Erreur lors de l'ajout du commentaire");
        }
    };

    // Charger les commentaires au montage du composant
    useEffect(() => {
        fetchComments();
    }, [blogId]);

    if (loading) return <p>Chargement des commentaires...</p>;

    return (
        <div className="comments-section">
            <h5>Commentaires</h5>
            <ul className="list-group mb-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <li key={comment.id} className="list-group-item">
                            <strong>{comment.user.name}</strong>: {comment.text}
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">Pas encore de commentaires</li>
                )}
            </ul>

            <form onSubmit={handleCommentSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="form-control"
                        placeholder="Ajoutez un commentaire"
                    />
                    <button type="submit" className="btn btn-primary">Soumettre</button>
                </div>
            </form>
        </div>
    );
};

export default CommentBlog;
