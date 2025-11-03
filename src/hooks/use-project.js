import { useState, useEffect } from "react";
import getProject from "../api/get-project";

export function useProject(projectId) {
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!projectId) {
            setProject(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
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
    }, [projectId]);

    return { project, isLoading, error };
}