import { useState, useCallback } from "react";
import postPledge from "../api/post-pledge";

const ERROR_MESSAGES = {
    CONTENT_REQUIRED: "Please add your creative contribution",
    AMOUNT_REQUIRED: "Please specify the number of verses",
    PROJECT_REQUIRED: "Project ID is required"
};

export default function useCreatePledge() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const createPledge = useCallback(async (projectId, pledgeData) => {
        // Validate required fields
        if (!projectId) {
            throw new Error(ERROR_MESSAGES.PROJECT_REQUIRED);
        }
        if (!pledgeData?.amount) {
            throw new Error(ERROR_MESSAGES.AMOUNT_REQUIRED);
        }
        if (!pledgeData?.add_content?.trim()) {
            throw new Error(ERROR_MESSAGES.CONTENT_REQUIRED);
        }

        console.log("Starting pledge creation:", { projectId, pledgeData });
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log("Sending pledge to API...");
            const response = await postPledge(projectId, {
                ...pledgeData,
                add_content: pledgeData.add_content.trim()
            });
            console.log("Pledge API response:", response);

            setSuccess("🎉 Thank you for your pledge!");
            return response;
        } catch (err) {
            console.error("Error creating pledge:", {
                error: err,
                message: err.message,
                projectId,
                pledgeData
            });
            setError(err.message);
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