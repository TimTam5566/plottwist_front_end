import { useState } from "react";
import putProject from "../api/put-project";

function EditProject({ projectId, initialData, onSuccess }) {
    const [formData, setFormData] = useState(initialData);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await putProject(projectId, formData);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Example fields */}
            <label htmlFor="title">Title</label>
            <input id="title" value={formData.title} onChange={handleChange} />

            <label htmlFor="description">Description</label>
            <textarea id="description" value={formData.description} onChange={handleChange} />

            {/* Add other fields as needed */}

            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}

export default EditProject;