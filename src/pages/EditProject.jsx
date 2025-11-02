import { useState, useEffect } from "react";
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

    return (
        <div className="page-wrap">
            <h2>Edit Project</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="genre">Genre:</label>
                    <input
                        type="text"
                        id="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="goal">Goal:</label>
                    <input
                        type="number"
                        id="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="image">Project Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    {imagePreview && (
                        <img 
                            src={imagePreview}
                            alt="Project preview" 
                            style={{ maxWidth: '200px', marginTop: '10px' }} 
                        />
                    )}
                </div>

                <div>
                    <label htmlFor="starting_content">Starting Content:</label>
                    <textarea
                        id="starting_content"
                        value={formData.starting_content}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="is_open">Open for contributions:</label>
                    <input
                        type="checkbox"
                        id="is_open"
                        checked={formData.is_open}
                        onChange={handleChange}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

export default EditProject;