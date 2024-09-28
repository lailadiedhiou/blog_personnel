import React, { useState } from 'react'
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const CreateBlog = () => {
    const [html, setHtml] = useState('');
    const [imageId, setImageId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);  // Nouvel état pour le chargement

    const navigate = useNavigate();

    function onChange(e) {
        setHtml(e.target.value);
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:8000/api/save-temp-image/", {
                method: 'POST',
                body: formData
            });

            const result = await res.json();

            if (result.status === false) {
                toast.error(result.errors.image);
                e.target.value = null;
            } else {
                setImageId(result.image);
                toast.success("Image uploaded successfully.");
            }
        } catch (error) {
            toast.error("Image upload failed.");
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const formSubmit = async (data) => {
        setIsSubmitting(true);  // Désactive le bouton de soumission
        const newData = { ...data, description: html, image_id: imageId }

        try {
            const res = await fetch("http://localhost:8000/api/blogs", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newData)
            });

            if (res.ok) {
                toast.success("Blog added successfully.");
                navigate('/');
            } else {
                const result = await res.json();
                toast.error("Failed to add blog: " + result.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the blog.");
        } finally {
            setIsSubmitting(false);  // Réactive le bouton après la soumission
        }
    }

    return (
        <div className='container mb-5'>
            <div className="d-flex justify-content-between pt-5 mb-4">
                <h4>Create Blog</h4>
                <a href='/' className='btn btn-dark'>Back</a>
            </div>
            <div className='card border-0 shadow-lg'>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className='card-body'>
                        <div className="mb-3">
                            <label className='form-label'>Title</label>
                            <input 
                                { ...register('title', { required: "Title field is required" }) } 
                                type="text" 
                                className={`form-control ${errors.title && 'is-invalid'}`} 
                                placeholder='Title' />
                            {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Short Description</label>
                            <textarea 
                                { ...register('shortDesc') } 
                                cols="30" rows="5" className='form-control'></textarea>
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Description</label>
                            <Editor value={html} 
                            containerProps={{ style: { height: '700px' } }}
                            onChange={onChange} />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Image</label><br/>
                            <input onChange={handleFileChange} type="file" />
                        </div>
                        <div className="mb-3">
                            <label className='form-label'>Author</label>
                            <input 
                                { ...register('author', { required: "Author field is required" }) } 
                                type="text" 
                                className={`form-control ${errors.author && 'is-invalid'}`} 
                                placeholder='Author' />
                            {errors.author && <p className='invalid-feedback'>{errors.author.message}</p>}
                        </div>
                        <button 
                            className='btn btn-dark' 
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateBlog;
