/**
 * ============================================================
 * PROJECTFORM.JSX - Create New Project Form
 * ============================================================
 * 
 * Literary-themed form for creating new stories/poems.
 * Uses useCreateProject hook for consistent pattern with PledgeForm.
 * Supports image uploads via FormData.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCreateProject from "../hooks/use-create-project";
import "./ProjectForm.css";
import { useAuth } from "../hooks/use-auth";

function ProjectForm({ onSuccess, initialData }) {
    // ============================================================
    // HOOKS
    // ============================================================
    const { auth } = useAuth();
    const navigate = useNavigate();
    const { createProject, isLoading, error: submitError, success } = useCreateProject();

    // ============================================================
    // STATE
    // ============================================================
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
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);

    // ============================================================
    // VALIDATION
    // ============================================================
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

    // ============================================================
    // HANDLERS
    // ============================================================
    const handleChange = (e) => {
        const { id, type, checked, files } = e.target;
        
        if (id === 'image' && files?.length) {
            const file = files[0];
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setFormData(prev => ({
                ...prev,
                [id]: type === "checkbox" ? checked : e.target.value,
            }));
        }

        // Clear validation error when field is edited
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

        // Validate
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            // Use the hook to create project (includes image)
            const response = await createProject(
                { ...formData, image: imageFile },
                auth.token,
                auth.user_id
            );

            if (response?.id) {
                onSuccess?.();
                navigate(`/project/${response.id}`);
            }
        } catch (err) {
            // Error is handled by the hook and available via submitError
            console.error("Form submission error:", err);
        }
    };

    // ============================================================
    // EFFECTS
    // ============================================================
    
    // Cleanup image preview URL on unmount
    useEffect(() => {
        return () => {
            if (imagePreview && !initialData?.image) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview, initialData]);

    // ============================================================
    // HELPERS
    // ============================================================
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

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="project-form-wrapper">
            <form onSubmit={handleSubmit} className="project-form" encType="multipart/form-data">
                <div className="form-header">
                    <span className="form-icon">✒</span>
                    <h2>Begin a New Tale</h2>
                    <p className="form-subtitle">Every great story starts with a single word...</p>
                </div>

                {/* API Error from hook */}
                {submitError && (
                    <div className="error-message api-error">
                        <span className="error-icon">📜</span>
                        <p>Alas! The magical quill has run dry. {submitError}</p>
                    </div>
                )}

                {/* Success message */}
                {success && (
                    <div className="success-message">
                        <p>✨ Your tale has been published to the library!</p>
                    </div>
                )}

                <div className="form-field">
                    <label htmlFor="title">Title <span className="required">*</span></label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="What shall we call this tale?"
                        className={validationErrors.title ? 'has-error' : ''}
                    />
                    {validationErrors.title && (
                        <span className="error-text">{validationErrors.title}</span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="description">Description <span className="required">*</span></label>
                    <textarea 
                        id="description" 
                        value={formData.description} 
                        onChange={handleChange}
                        placeholder="Set the scene for your readers..."
                        className={validationErrors.description ? 'has-error' : ''}
                    />
                    {validationErrors.description && (
                        <span className="error-text">{validationErrors.description}</span>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="genre">Genre <span className="required">*</span></label>
                        <select
                            id="genre"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            aria-label="Select project genre"
                            required
                            className={validationErrors.genre ? 'has-error' : ''}
                        >
                            <option value="">Select a realm...</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Romance">Romance</option>
                            <option value="Modern Drama">Modern Drama</option>
                            <option value="Historical">Historical</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Childrens Fiction">Children's Fiction</option>
                            <option value="Fantasy/Mythology">Fantasy/Mythology</option>
                        </select>
                        {validationErrors.genre && (
                            <span className="error-text">{validationErrors.genre}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="content_type">Content Type <span className="required">*</span></label>
                        <select
                            id="content_type"
                            name="content_type"
                            value={formData.content_type}
                            onChange={handleChange}
                            aria-label="Select content type"
                            required
                            className={validationErrors.content_type ? 'has-error' : ''}
                        >
                            <option value="">Prose or verse?</option>
                            <option value="poem">Poem</option>
                            <option value="story">Story</option>
                        </select>
                        {validationErrors.content_type && (
                            <span className="error-text">{validationErrors.content_type}</span>
                        )}
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="starting_content">Opening Words <span className="required">*</span></label>
                    <textarea
                        id="starting_content"
                        value={formData.starting_content}
                        onChange={handleChange}
                        maxLength="5000"
                        placeholder="Once upon a time... or perhaps something more unexpected?"
                        className={validationErrors.starting_content ? 'has-error' : ''}
                    />
                    {validationErrors.starting_content && (
                        <span className="error-text">{validationErrors.starting_content}</span>
                    )}
                </div>

                {formData.starting_content && (
                    <div className="content-preview">
                        <h4>📖 Preview:</h4>
                        <div className="formatted-content">
                            {formatContent(formData.starting_content)}
                        </div>
                    </div>
                )}

                <div className="form-field">
                    <label htmlFor="goal">
                        {formData.content_type === 'poem' ? 'Target Verses' : 'Target Paragraphs'} 
                        <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        id="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        min="1"
                        placeholder="How long shall this tale grow?"
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

                <div className="form-field">
                    <label htmlFor="image">Cover Image</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <span className="file-input-text">Choose a cover for your tale...</span>
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

                <div className="form-actions">
                    <button type="submit" className="btn btn--primary" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner">✒</span>
                                Writing...
                            </>
                        ) : (
                            "Publish Your Tale"
                        )}
                    </button>
                </div>

                <p className="form-footer">
                    <span className="required">*</span> Required fields
                </p>
            </form>
        </div>
    );
}

export default ProjectForm;
