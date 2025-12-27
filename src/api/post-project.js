/**
 * ============================================================
 * POST-PROJECT.JS - Create a New Project
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Creates a new project/story in the database.
 * 
 * WHEN IT'S USED:
 * - CreateProjectPage form submission
 * 
 * API ENDPOINT: POST /projects/
 * AUTHENTICATION: Required (Token)
 * 
 * PARAMETERS:
 * - projectData: Object with project details
 * - authToken: User's authentication token
 * - userId: ID of the user creating the project
 */

import { useAuth } from "../hooks/use-auth";

async function postProject(projectData, authToken, userId) {
    const url = `${import.meta.env.VITE_API_URL}/projects/`;
    
    // Validate authentication
    if (!authToken || !userId) {
        throw new Error('Authentication required');
    }
    
    // Convert userId to number (it might be a string from localStorage)
    const ownerId = Number(userId);
    
    if (isNaN(ownerId)) {
        throw new Error('Invalid user ID format');
    }

    // ============================================================
    // FORMDATA - Required for file uploads!
    // ============================================================
    /**
     * WHY FORMDATA INSTEAD OF JSON?
     * 
     * JSON.stringify() can't handle files (images).
     * FormData can send both text AND files in one request.
     * 
     * The browser automatically sets:
     * Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
     * 
     * DON'T manually set Content-Type with FormData - it breaks the boundary!
     */
    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("goal", projectData.goal);
    formData.append("genre", projectData.genre);
    formData.append("owner", ownerId);
    formData.append("starting_content", projectData.startingVerseParagraph || "");
    formData.append("is_open", true);

    // Only append image if one was selected
    if (projectData.image) {
        formData.append("image", projectData.image);
    }
    // Send the request
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Token ${authToken}`,
            // NO Content-Type header! Browser sets it automatically for FormData
        },
        body: formData,
    });
    // Error handling
    if (!response.ok) {
        const fallbackError = `HTTP ${response.status}: Error creating project`;

        try {
            const responseText = await response.text();
            console.log("Server error response:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                const error = new Error(responseText || fallbackError);
                error.response = {
                    status: response.status,
                    statusText: response.statusText,
                    data: { detail: responseText },
                };
                throw error;
            }

            const error = new Error(data?.detail || fallbackError);
            error.response = {
                status: response.status,
                statusText: response.statusText,
                data: data,
            };
            throw error;
        } catch (networkError) {
            const error = new Error(fallbackError);
            error.response = {
                status: response.status,
                statusText: response.statusText,
                data: null,
            };
            throw error;
        }
    }
    // Success! Return the created project
    return await response.json();
}

export default postProject;