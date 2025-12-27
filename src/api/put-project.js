/**
 * ============================================================
 * PUT-PROJECT.JS - Update an Existing Project
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Updates a project with new data (title, description, image, etc.)
 * 
 * WHEN IT'S USED:
 * - EditProject page form submission
 * 
 * API ENDPOINT: PUT /projects/{id}/
 * AUTHENTICATION: Required (Token) + Must be project owner
 * 
 * PARAMETERS:
 * - id: Project ID to update
 * - formData: FormData object with updated fields
 */
import { API_URL } from "../config";

async function putProject(id, formData) {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Send PUT request
    const response = await fetch(`${API_URL}/projects/${id}/`, {
        method: "PUT",
        headers: {
            Authorization: `Token ${token}`,
            // NO Content-Type for FormData - browser sets it automatically
        },
        body: formData
    });
    // Handle errors
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "The ink refused to flow. Your edits remain trapped in the margins — try again, brave scribe!");
    }

    return response.json();
}

export default putProject;

/**
 * NOTE ON PERMISSIONS:
 * 
 * The backend has IsOwnerOrReadOnly permission.
 * Only the project owner can successfully PUT.
 * If someone else tries, they get 403 Forbidden.
 */
``