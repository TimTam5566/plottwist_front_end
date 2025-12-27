/**
 * ============================================================
 * POST-PROJECT.JS - Create Project API Function
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Pure API function that sends a POST request to create a new project.
 * Uses FormData to support image uploads.
 * 
 * RETURNS:
 * - Success: Project data from API
 * - Failure: Throws error with message
 * 
 * USED BY:
 * - use-create-project.js hook (recommended)
 * - Can be called directly if needed
 */

import { API_URL } from "../config";

async function postProject(projectData, authToken, userId) {
    const url = `${API_URL}/projects/`;
    
    // ============================================================
    // VALIDATE AUTH
    // ============================================================
    if (!authToken || !userId) {
        throw new Error("Authentication required");
    }

    const ownerId = Number(userId);
    if (isNaN(ownerId)) {
        throw new Error("Invalid user ID format");
    }

    // ============================================================
    // BUILD FORMDATA (supports file uploads)
    // ============================================================
    const formData = new FormData();
    
    // Required fields
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("goal", projectData.goal);
    formData.append("genre", projectData.genre);
    formData.append("content_type", projectData.content_type);
    formData.append("owner", ownerId);
    formData.append("is_open", true);
    
    // Content fields
    if (projectData.starting_content) {
        formData.append("starting_content", projectData.starting_content);
    }
    if (projectData.current_content) {
        formData.append("current_content", projectData.current_content);
    }
    
    // Image file (if provided)
    if (projectData.image) {
        formData.append("image", projectData.image);
    }

    // ============================================================
    // SEND REQUEST
    // ============================================================
    const response = await fetch(url, {
        method: "POST",
        headers: {
            // Note: Don't set Content-Type for FormData - browser sets it automatically
            Authorization: `Token ${authToken}`,
        },
        body: formData,
    });

    // ============================================================
    // HANDLE RESPONSE
    // ============================================================
    if (!response.ok) {
        const fallbackError = `HTTP ${response.status}: Error creating project`;

        try {
            const responseText = await response.text();
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                const error = new Error(responseText || fallbackError);
                error.status = response.status;
                throw error;
            }

            const error = new Error(data?.detail || fallbackError);
            error.status = response.status;
            error.data = data;
            throw error;
        } catch (err) {
            if (err.status) throw err; // Re-throw if already formatted
            const error = new Error(fallbackError);
            error.status = response.status;
            throw error;
        }
    }

    return await response.json();
}

export default postProject;