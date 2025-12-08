/**
 * put-project.js
 * 
 * This file provides an async function to update an existing project (fundraiser) via the backend API.
 * 
 * Function:
 * - `putProject(id, formData)`:
 *    - Sends a PUT request to the `/projects/{id}/` endpoint with the updated project details.
 *    - Uses FormData to handle both text fields and image uploads.
 *    - Includes authentication using a token from localStorage.
 *    - Handles errors by parsing the server response and throwing a detailed error message if the request fails.
 *    - Returns the parsed JSON response containing the updated project data on success.
 * 
 * Linked to:
 * - Used by project editing forms/components (e.g., `ProjectForm.jsx` in edit mode).
 * - Allows authenticated users to update existing projects from the frontend.
 * - Ensures proper error handling and feedback for project updates.
 */
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