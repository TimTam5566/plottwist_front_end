import { useState } from "react";
import postProject from "../api/post-project";

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
     * @param {Object} projectData - Project fields (title, description, image, etc.)
     * @param {string} authToken - User's auth token
     * @param {string|number} userId - User's ID (will be set as owner)
     * @returns {Object} - Created project data from API
     */
    const createProject = async (projectData, authToken, userId) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Call the API function
            const data = await postProject(projectData, authToken, userId);
            
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
    // RESET FUNCTION
    // ============================================================
    /**
     * Reset all states (useful for form reset or retry)
     */
    const reset = () => {
        setIsLoading(false);
        setError(null);
        setSuccess(false);
    };

    return { createProject, isLoading, error, success, reset };
}