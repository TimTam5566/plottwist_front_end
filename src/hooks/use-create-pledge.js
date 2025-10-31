import { useState, useCallback } from "react";
import postPledge from "../api/post-pledge";

export default function useCreatePledge() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Accept projectId and pledgeData as arguments
    const createPledge = useCallback(async (projectId, pledgeData) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const newPledge = await postPledge(projectId, pledgeData);
            setSuccess("🎉 Thank you for your pledge!");
            return newPledge;
        } catch (err) {
            console.error("Error creating pledge:", err);
            setError(err.message || "Failed to submit pledge. Please try again.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        createPledge,
        isLoading,
        error,
        success,
    };
}