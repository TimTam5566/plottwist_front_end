import { useState } from "react";

export default function useCreateProject() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createProject = async (projectData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/projects/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(projectData),
                }
            );

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