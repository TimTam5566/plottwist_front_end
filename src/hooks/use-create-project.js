/** ============================================================
 * USE-CREATE-PROJECT.JS - Create New Project Hook
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Handles creating a new project with loading/error/success states.
 * 
 * RETURNS:
 * - createProject(projectData): Async function to create project
 * - isLoading: Boolean - is submission in progress?
 * - error: Error message or null
 * - success: Boolean - did creation succeed?
 */

import { useState } from "react";

import { API_URL } from "../config";

export default function useCreateProject() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createProject = async (projectData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/projects/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(projectData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Failed to create project");
            }

            setSuccess(true);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createProject, isLoading, error, success };
}