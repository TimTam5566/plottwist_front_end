/**
 * ============================================================
 * USE-CREATE-PLEDGE.JS - Submit Contributions
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Handles creating a new pledge (story contribution) with
 * validation, loading states, and error handling.
 * 
 * RETURNS:
 * - createPledge: Function to call with (projectId, pledgeData)
 * - isLoading: Boolean - is submission in progress?
 * - error: Error message or null
 * - success: Success message or null
 */

import { useState, useCallback } from "react";
import postPledge from "../api/post-pledge";

// Error message constants (good practice!)
const ERROR_MESSAGES = {
    CONTENT_REQUIRED: "Please add your creative contribution",
    AMOUNT_REQUIRED: "Please specify the number of verses",
    PROJECT_REQUIRED: "Project ID is required"
};

export default function useCreatePledge() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // ============================================================
    // CREATE PLEDGE FUNCTION
    // ============================================================
    /**
     * useCallback ensures this function is stable across renders.
     * Important for performance and preventing infinite loops.
     */

    const createPledge = useCallback(async (projectId, pledgeData) => {
        // ========== VALIDATION ==========
        if (!projectId) {
            throw new Error(ERROR_MESSAGES.PROJECT_REQUIRED);
        }
        if (!pledgeData?.amount) {
            throw new Error(ERROR_MESSAGES.AMOUNT_REQUIRED);
        }
        if (!pledgeData?.add_content?.trim()) {
            throw new Error(ERROR_MESSAGES.CONTENT_REQUIRED);
        }
        // ========== START SUBMISSION ==========
        console.log("Starting pledge creation:", { projectId, pledgeData });
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log("Sending pledge to API...");

            // Call the API function
            const response = await postPledge(projectId, {
                ...pledgeData,
                add_content: pledgeData.add_content.trim()  // Clean whitespace
            });
            console.log("Pledge API response:", response);

            // Success!
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
            throw err; // Re-throw so component can handle it
        } finally {
            setIsLoading(false);    // Always stop loading
        }
    }, []); // Empty deps = stable function

    return {
        createPledge,
        isLoading,
        error,
        success,
    };
}

/**
 * USAGE:
 * 
 * function PledgeForm({ projectId }) {
 *     const { createPledge, isLoading, error, success } = useCreatePledge();
 *     
 *     const handleSubmit = async (e) => {
 *         e.preventDefault();
 *         try {
 *             await createPledge(projectId, {
 *                 amount: 1,
 *                 add_content: "My story contribution...",
 *                 anonymous: false
 *             });
 *             // Success! Maybe refresh the page
 *         } catch (err) {
 *             // Error is already in `error` state
 *         }
 *     };
 *     
 *     return (
 *         <form onSubmit={handleSubmit}>
 *             {error && <p className="error">{error}</p>}
 *             {success && <p className="success">{success}</p>}
 *             <button disabled={isLoading}>
 *                 {isLoading ? "Submitting..." : "Submit"}
 *             </button>
 *         </form>
 *     );
 * }
 */