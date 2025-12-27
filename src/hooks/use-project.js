/**
 * ============================================================
 * USE-PROJECT.JS - Fetch Single Project by ID
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Fetches ONE project with full details (including pledges).
 * 
 * PARAMETERS:
 * - projectId: The ID of the project to fetch
 * 
 * RETURNS:
 * - project: The project object (or null)
 * - isLoading: Boolean
 * - error: Error message or null
 */

import { useState, useEffect } from "react";
import getProject from "../api/get-project";

export function useProject(projectId) {
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ============================================================
    // FETCH ON ID CHANGE
    // ============================================================
    /**
     * useEffect runs when projectId changes.
     * 
     * If user navigates from /project/1 to /project/2,
     * this effect runs again with the new ID.
     */

    useEffect(() => {
        // Handle missing ID
        if (!projectId) {
            setProject(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Fetch the project
        getProject(projectId)
            .then((data) => {
                if (!data) throw new Error("No project data received");
                setProject(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Project fetch error:", err);
                setError("Failed to fetch project details");
                setProject(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [projectId]);  // Re-run when projectId changes

    return { project, isLoading, error };
}

/**
 * USAGE:
 * 
 * function ProjectPage() {
 *     const { id } = useParams();  // Get ID from URL
 *     const { project, isLoading, error } = useProject(id);
 *     
 *     if (isLoading) return <p>Loading...</p>;
 *     if (error) return <p>{error}</p>;
 *     
 *     return <h1>{project.title}</h1>;
 * }
 */