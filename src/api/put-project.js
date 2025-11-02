import { API_URL } from "../config";

async function putProject(id, formData) {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/projects/${id}/`, {
        method: "PUT",
        headers: {
            Authorization: `Token ${token}`,
            // Do not set Content-Type - browser will set it automatically for FormData
        },
        body: formData
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "The ink refused to flow. Your edits remain trapped in the margins — try again, brave scribe!");
    }

    return response.json();
}

export default putProject;