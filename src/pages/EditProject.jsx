/**
 * EditProject.jsx - Literary Theme
 * 
 * Edit an existing project/tale
 */

import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import putProject from "../api/put-project";
import getProject from "../api/get-project";
import { API_URL } from "../config";
import "./EditProject.css";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        goal: "",
        starting_content: "",
        is_open: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Scroll to top when page loads
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProject(id);
                setFormData({
                    title: data.title,
                    description: data.description,
                    genre: data.genre,
                    goal: data.goal,
                    starting_content: data.starting_content,
                    is_open: data.is_open
                });
                // Set image preview if exists
                if (data.image) {
                    setImagePreview(data.image.startsWith('/media') 
                        ? `${API_URL}${data.image}` 
                        : data.image
                    );
                }
            } catch (err) {
                setError("The ink refused to flow. Your edits remain trapped in the margins — try again, brave scribe!");
            }
        };
        fetchProject();
    }, [id]);

    const handleChange = (e) => {
        const { id, type, checked, files } = e.target;
        
        if (id === 'image' && files?.length) {
            const file = files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({
                ...prev,
                [id]: type === "checkbox" ? checked : e.target.value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formDataToSend = new FormData();
            
            // Append all text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formDataToSend.append(key, value);
                }
            });
            
            // Append image file if selected
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            await putProject(id, formDataToSend);
            navigate(`/project/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/project/${id}`);
    };

    return (
        <div className="edit-project-page">
            <div className="page-wrap">
                <div className="edit-form-container">
                    <div className="form-header">
                        <span className="form-icon">✎</span>
                        <h1>Revise Your Tale</h1>
                        <p className="form-subtitle">Every story deserves a second draft...</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-field">
                            <label htmlFor="title">Title <span className="required">*</span></label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="What shall we call this tale?"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="description">Description <span className="required">*</span></label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Set the scene for your readers..."
                                required
                                rows="4"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="genre">Genre <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    placeholder="Fantasy, Romance, Mystery..."
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="goal">Goal (verses/paragraphs) <span className="required">*</span></label>
                                <input
                                    type="number"
                                    id="goal"
                                    value={formData.goal}
                                    onChange={handleChange}
                                    placeholder="How many contributions?"
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="image">Cover Image</label>
                            <div className="image-upload-area">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="file-input"
                                />
                                <label htmlFor="image" className="file-label">
                                    📷 Choose a new cover image
                                </label>
                            </div>
                            {imagePreview && (
                                <div className="image-preview">
                                    <img 
                                        src={imagePreview}
                                        alt="Project preview" 
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="starting_content">Opening Words <span className="required">*</span></label>
                            <textarea
                                id="starting_content"
                                value={formData.starting_content}
                                onChange={handleChange}
                                placeholder="The first words of your tale..."
                                required
                                rows="8"
                            />
                        </div>

                        <div className="form-field checkbox-field">
                            <label htmlFor="is_open" className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="is_open"
                                    checked={formData.is_open}
                                    onChange={handleChange}
                                />
                                <span className="checkbox-text">
                                    {formData.is_open 
                                        ? "✨ Open for contributions — fellow authors may add their voice" 
                                        : "📕 Closed — this tale is complete"}
                                </span>
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn--primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner">✒</span>
                                        Saving your revisions...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                            <button type="button" className="btn btn--secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>

                        <p className="form-note">* Required fields</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProject;
