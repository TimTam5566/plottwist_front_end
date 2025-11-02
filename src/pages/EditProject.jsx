import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import putProject from "../api/put-project";
import getProject from "../api/get-project";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        goal: "",
        image: "",
        starting_content: "",
        is_open: true
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch project data when component mounts
        const fetchProject = async () => {
            try {
                const data = await getProject(id);
                setFormData(data);
            } catch (err) {
                setError("Failed to load projectThe ink refused to flow. Your edits remain trapped in the margins — try again, brave scribe!");
            }
        };
        fetchProject();
    }, [id]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await putProject(id, formData);
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
                    <label htmlFor="image">Image URL:</label>
                    <input
                        type="url"
                        id="image"
                        value={formData.image}
                        onChange={handleChange}
                    />
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