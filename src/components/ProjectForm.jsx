import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCreateProject from "../hooks/use-create-project";
import putProject from "../api/put-project";
import "./ProjectForm.css";


function ProjectForm({ onSuccess, projectId, isOwner, isEditMode, initialData }) {
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState(initialData || {
        title: "",
        description: "",
        genre: "",
        content_type: "",
        starting_content: "",
        current_content: "",
        goal: "",
        is_open: true,
        date_created: new Date().toISOString()
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);
    const { createProject, isLoading, error } = useCreateProject();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (!formData.genre) newErrors.genre = "Genre is required.";
        if (!formData.content_type) newErrors.content_type = "Content type is required.";
        if (!formData.starting_content.trim()) newErrors.starting_content = "Starting content is required.";
        if (!formData.goal) newErrors.goal = "Verse or Paragraph amount is required.";
        else if (Number(formData.goal) <= 0) newErrors.goal = "Goal must be positive.";
        // Removed image URL validation since we're using file upload

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, type, checked, files } = e.target;
        
        if (id === 'image' && files?.length) {
            const file = files[0];
            setImageFile(file);
            // Create preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setFormData(prev => ({
                ...prev,
                [id]: type === "checkbox" ? checked : e.target.value,
            }));
        }

        if (validationErrors[id]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Use FormData for file upload
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
            if (key !== 'image') { // Skip image field as we'll handle it separately
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append the image file if one is selected
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        }

        try {
            if (isEditMode) {
                await putProject(projectId, formDataToSend);
            } else {
                await createProject(formDataToSend);
            }
            
            if (onSuccess) onSuccess();
            
            // Cleanup
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        } catch (err) {
            console.error("Error:", err);
            setValidationErrors(prev => ({
                ...prev,
                api: err.message || "Failed to save project"
            }));
        }
    };

    // Cleanup preview URL when component unmounts
    React.useEffect(() => {
        return () => {
            if (imagePreview && !initialData?.image) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview, initialData]);

    const formatContent = (content) => {
        return content.split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
        ));
    };

    return (
        <form onSubmit={handleSubmit} className="project-form" encType="multipart/form-data">
            <h2>Create a Project</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <label htmlFor="title">Title *</label>
            <input id="title" value={formData.title} onChange={handleChange} />
            {validationErrors.title && <p style={{ color: "red" }}>{validationErrors.title}</p>}

            <label htmlFor="description">Description *</label>
            <textarea id="description" value={formData.description} onChange={handleChange} />
            {validationErrors.description && <p style={{ color: "red" }}>{validationErrors.description}</p>}

            <label htmlFor="genre">Genre *</label>
            <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                aria-label="Select project genre"
                required
            >
                <option value="">Select a genre</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Modern Drama">Modern Drama</option>
                <option value="Historical">Historical</option>
                <option value="Comedy">Comedy</option>
                <option value="Childrens Fiction">Children's Fiction</option>
                <option value="Fantasy/Mythology">Fantasy/Mythology</option>
            </select>
            {validationErrors.genre && <p style={{ color: "red" }}>{validationErrors.genre}</p>}

            <label htmlFor="content_type">Content Type *</label>
            <select
                id="content_type"
                name="content_type"
                value={formData.content_type}
                onChange={handleChange}
                aria-label="Select content type"
                required
            >
                <option value="">Select type</option>
                <option value="poem">Poem</option>
                <option value="story">Story</option>
            </select>
            {validationErrors.content_type && <p style={{ color: "red" }}>{validationErrors.content_type}</p>}

            <div className="form-group">
                <label htmlFor="starting_content">Starting Content *</label>
                <textarea
                    id="starting_content"
                    value={formData.starting_content}
                    onChange={handleChange}
                    maxLength="5000"
                    placeholder="Enter your starting content here... Press Enter twice for new paragraphs."
                    style={{
                        whiteSpace: "pre-wrap",
                        minHeight: "200px",
                        padding: "10px",
                        lineHeight: "1.5"
                    }}
                />
                {validationErrors.starting_content && (
                    <p className="error">{validationErrors.starting_content}</p>
                )}
            </div>

            {formData.starting_content && (
                <div className="content-preview">
                    <h4>Content Preview:</h4>
                    <div className="formatted-content">
                        {formatContent(formData.starting_content)}
                    </div>
                </div>
            )}

            <label htmlFor="goal">Verse or Paragraph Amount *</label>
            <input 
                id="goal" 
                type="number" 
                value={formData.goal} 
                onChange={handleChange} 
            />
            {validationErrors.goal && <p style={{ color: "red" }}>{validationErrors.goal}</p>}

            <div className="form-group">
                <label htmlFor="image">Project Image</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleChange}
                />
                {imagePreview && (
                    <div className="image-preview">
                        <img 
                            src={imagePreview} 
                            alt="Project preview"
                            style={{ 
                                maxWidth: '200px', 
                                display: 'block',
                                margin: '10px 0',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                )}
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
            </button>

            {isEditMode && isOwner && (
                <button type="button" onClick={handleEdit} style={{ marginLeft: "1rem" }}>
                    Edit Project
                </button>
            )}
        </form>
    );
}

export default ProjectForm;