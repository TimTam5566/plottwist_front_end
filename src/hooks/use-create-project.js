/**
 * ============================================================
 * USE-CREATE-PROJECT.JS - Create Project Hook
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Custom hook for creating new projects with image upload support.
 * Handles loading, error, and success states.
 * 
 * USES FormData to support image uploads (not JSON).
 * 
 * RETURNS:
 * - createProject(projectData): Async function to create project
 * - isLoading: Boolean - is submission in progress?
 * - error: Error message or null
 * - success: Boolean - did creation succeed?
 * 
 * USAGE:
 * const { createProject, isLoading, error, success } = useCreateProject();
 * await createProject({ title, description, image, ... });
 */

import { useState } from "react";
import { API_URL } from "../config";

export default function useCreateProject() {
    // ============================================================
    // STATE
    // ============================================================
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // ============================================================
    // CREATE PROJECT FUNCTION
    // ============================================================
    /**
     * Creates a new project with optional image upload
     * 
     * @param {Object} projectData - Project fields (title, description, etc.)
     * @param {string} authToken - User's auth token
     * @param {string|number} userId - User's ID (will be set as owner)
     * @returns {Object} - Created project data from API
     */
    const createProject = async (projectData, authToken, userId) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        // Validate auth
        if (!authToken || !userId) {
            setError("Authentication required");
            setIsLoading(false);
            throw new Error("Authentication required");
        }

        const ownerId = Number(userId);
        if (isNaN(ownerId)) {
            setError("Invalid user ID format");
            setIsLoading(false);
            throw new Error("Invalid user ID format");
        }

        try {
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
            const response = await fetch(`${API_URL}/projects/`, {
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
                const errorText = await response.text();
                let errorMessage = `HTTP ${response.status}: Error creating project`;
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.detail || errorMessage;
                } catch {
                    if (errorText) errorMessage = errorText;
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setSuccess(true);
            return data;

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================================
    // RESET FUNCTION (optional - to clear states)
    // ============================================================
    const reset = () => {
        setIsLoading(false);
        setError(null);
        setSuccess(false);
    };

    return { createProject, isLoading, error, success, reset };
}