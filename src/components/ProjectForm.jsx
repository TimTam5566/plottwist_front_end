import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCreateProject from "../hooks/use-create-project";
import postProject from "../api/post-project";
import "./ProjectForm.css";
import { useAuth } from "../hooks/use-auth";
import { useProject } from "../hooks/use-project"; // Updated import


function ProjectForm({ onSuccess, projectId, isOwner, isEditMode, initialData }) {
    const { project, setProject } = useProject(projectId);
    // Update existing debug log to include more detail
    console.log('ProjectForm mounted:', { 
        projectId, 
        initialData,
        hasProject: Boolean(project),
        projectData: project
    });

    // Add useEffect to track project data changes
    useEffect(() => {
        console.log('Project data updated:', {
            projectId,
            project,
            initialData
        });
    }, [projectId, project, initialData]);

    const { auth } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
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
    const { createProject, isLoading } = useCreateProject();
    

    const validateForm = (data) => {
        const errors = {};
        
        if (!data.title?.trim()) {
            errors.title = "Every story needs a title to begin its journey!";
        }
        
        if (!data.description?.trim()) {
            errors.description = "Paint us a picture with your description...";
        }
        
        if (!data.goal) {
            errors.goal = "Every journey needs a destination - how many verses or paragraphs await?";
        } else if (Number(data.goal) <= 0) {
            errors.goal = "The path ahead needs at least one step!";
        } else {
            // Calculate current progress
            const contentSegments = data.content_type === 'poem'
                ? data.current_content?.split('\n').filter(line => line.trim().length > 0).length || 0
                : data.current_content?.split(/\n\n+/).filter(para => para.trim().length > 0).length || 0;
                
            if (contentSegments > Number(data.goal)) {
                errors.goal = `Your tale has grown beyond its bounds! Current ${data.content_type === 'poem' ? 'verses' : 'paragraphs'}: ${contentSegments}`;
            }
        }
        
        if (!data.genre?.trim()) {
            errors.genre = "In which realm does your tale unfold?";
        }
        
        if (!data.content_type) {
            errors.content_type = "Will your story flow in prose or dance in verse?";
        }
        
        if (!data.starting_content?.trim()) {
            errors.starting_content = "Every adventure needs its first step - add your opening words!";
        }

        return errors;
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
        console.log('Submitting project with data:', {
            formData,
            auth,
            projectId
        });

        // Validate form before submission
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const response = await postProject(
                formData,
                auth.token,
                auth.user_id
            );

            if (response?.id) {
                navigate(`/project/${response.id}`);
            }

        } catch (err) {
            // Maintain existing creative error message
            setError("Alas! The magical quill has run dry. Our story stumbled on its way to the library. Perhaps Mercury is in retrograde, or the muse is taking a coffee break. Let's try that again, shall we?");
            console.error("Form submission error:", err);
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

    const calculateProgress = (content, contentType, goal) => {
        if (!content || !goal) return 0;
        const segments = contentType === 'poem' 
            ? content.split('\n').filter(line => line.trim().length > 0)
            : content.split(/\n\n+/).filter(para => para.trim().length > 0);
        
        const count = segments.length;
        const percentage = (count / goal) * 100;
        return Math.min(percentage, 100);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form" encType="multipart/form-data">
            <h2>Create a Project</h2>

            {(error) && (
                <div className="error-message api-error">
                    <p>{"Alas! The magical quill has run dry. Our story stumbled on its way to the library. Perhaps Mercury is in retrograde, or the muse is taking a coffee break. Let's try that again, shall we?"}</p>
                </div>
            )}

            <div className="form-field">
                <label htmlFor="title">Title *</label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={validationErrors.title ? 'has-error' : ''}
                />
                {validationErrors.title && (
                    <span className="error-text">{validationErrors.title}</span>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="description">Description *</label>
                <textarea id="description" value={formData.description} onChange={handleChange} />
                {validationErrors.description && <p style={{ color: "red" }}>{validationErrors.description}</p>}
            </div>

            <div className="form-field">
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
            </div>

            <div className="form-field">
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
            </div>

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

            <div className="form-field">
                <label htmlFor="goal">Verse or Paragraph Amount *</label>
                <input
                    type="number"
                    id="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    min="1"
                    className={validationErrors.goal ? 'has-error' : ''}
                />
                {validationErrors.goal && (
                    <span className="error-text">{validationErrors.goal}</span>
                )}
                
                {formData.goal > 0 && (
                    <div className="progress-section">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${calculateProgress(
                                    formData.current_content, 
                                    formData.content_type, 
                                    formData.goal
                                )}%` }}
                            />
                        </div>
                        <p className="progress-text">
                            {formData.content_type === 'poem' ? 'Verses' : 'Paragraphs'}: 
                            {' '}
                            {formData.current_content
                                ? formData.content_type === 'poem'
                                    ? formData.current_content.split('\n').filter(line => line.trim().length > 0).length
                                    : formData.current_content.split(/\n\n+/).filter(para => para.trim().length > 0).length
                                : 0
                            }
                            {' '}/ {formData.goal}
                        </p>
                    </div>
                )}
            </div>

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