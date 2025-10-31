import { useState, useEffect } from "react";
import useCreateProject from "../hooks/use-create-project";
import putProject from "../api/put-project";
import { genreImages } from "../data/genreImages";

function ProjectForm({ onSuccess, projectId, isOwner, isEditMode, initialData }) {
    const [formData, setFormData] = useState(initialData || {
        title: "",
        description: "",
        genre: "",
        content_type: "",
        starting_content: "",
        goal: "",
        image: "",
        is_open: true,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const { createProject, isLoading, error, success } = useCreateProject();

    useEffect(() => {
        if (formData.genre) {
            setFormData(prev => ({
                ...prev,
                image: genreImages[formData.genre] || "",
            }));
        }
    }, [formData.genre]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (!formData.genre) newErrors.genre = "Genre is required.";
        if (!formData.content_type) newErrors.content_type = "Content type is required.";
        if (!formData.starting_content.trim()) newErrors.starting_content = "Starting content is required.";
        if (!formData.goal) newErrors.goal = "Verse or Paragraph amount is required.";
        else if (Number(formData.goal) <= 0) newErrors.goal = "Goal must be positive.";
        if (!formData.image.trim() || !formData.image.startsWith("http")) newErrors.image = "Image must be a valid URL.";
        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === 'genre' ? { image: genreImages[value] || "" } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const projectData = {
            title: formData.title,
            description: formData.description,
            genre: formData.genre,
            goal: Number(formData.goal),
            image: formData.image,
            is_open: formData.is_open,
            starting_content: formData.starting_content, // or formData.start if that's your state
        };

        try {
            await createProject(projectData);
            if (onSuccess) onSuccess();
            setFormData({
                title: "",
                description: "",
                genre: "",
                content_type: "",
                starting_content: "",
                goal: "",
                image: "",
                is_open: true,
            });
        } catch (error) {
            // Error handling as needed
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await putProject(projectId, formData);
            if (onSuccess) onSuccess();
        } catch (error) {
            // handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create a Project</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Project Created</p>}

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

            <label htmlFor="starting_content">
                Starting Content *
            </label>
            <textarea
                id="starting_content"
                value={formData.starting_content}
                onChange={handleChange}
                rows="10"
                maxLength="5000"
                placeholder="Enter your starting content here..."
            />
            {validationErrors.starting_content && (
                <p style={{ color: "red" }}>{validationErrors.starting_content}</p>
            )}

            <label htmlFor="goal">Verse or Paragraph Amount *</label>
            <input 
                id="goal" 
                type="number" 
                value={formData.goal} 
                onChange={handleChange} 
            />
            {validationErrors.goal && <p style={{ color: "red" }}>{validationErrors.goal}</p>}

            <div className="image-preview">
                {formData.genre && (
                    <>
                        <label>Selected Image</label>
                        <img 
                            src={formData.image} 
                            alt={`${formData.genre} category`}
                            style={{ 
                                maxWidth: '200px', 
                                display: 'block',
                                margin: '10px auto',
                                borderRadius: '4px'
                            }}
                        />
                    </>
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