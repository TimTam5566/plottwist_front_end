/**
 * ============================================================
 * POST-PLEDGE.JS - Submit a Contribution to a Project
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Creates a new pledge (story/poem contribution) for a project.
 * 
 * WHEN IT'S USED:
 * - PledgeForm component when user submits contribution
 * 
 * API ENDPOINT: POST /projects/{projectId}/pledges/
 * AUTHENTICATION: Required (Token)
 * 
 * PARAMETERS:
 * - projectId: The project to contribute to
 * - pledgeData: Object with { amount, add_content, comment, anonymous }
 */

// Error message constants
const ERROR_MESSAGES = {
    PROJECT_REQUIRED: "Project ID is required",
    AUTH_REQUIRED: "Authentication required",
    BAD_REQUEST: "Please check your pledge details"
};

export default async function postPledge(projectId, pledgeData) {
    // Validate project ID
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    // Get and validate auth token
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found");
    }

    // Build the URL - note the nested route!
    // POST /projects/5/pledges/ creates a pledge for project 5
    const url = `${import.meta.env.VITE_API_URL}/projects/${projectId}/pledges/`;

    // Debug logging (helpful for troubleshooting)
    console.log("Sending pledge request:", {
        url,
        projectId,
        hasToken: !!token,
        payload: pledgeData
    });

    try {
        // Send POST request
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // JSON, not FormData (no file upload)
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                amount: pledgeData.amount, // Number of paragraphs/verses
                add_content: pledgeData.add_content, // The actual story content
                comment: pledgeData.comment || `Contributed ${pledgeData.amount} verse(s)`,
                anonymous: pledgeData.anonymous // Now this actually saves if anon chosen
            })
        });
        // Debug logging
        console.log("Pledge response received:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });
        // Try to parse response
        let responseData;
        try {
            responseData = await response.json();
            console.log("Response data:", responseData);
        } catch (e) {
            console.log("No JSON response body");
            responseData = null;
        }
        // Handle errors
        if (!response.ok) {
            const errorMessage = responseData?.add_content?.[0] || 
                                responseData?.detail || 
                                `Error creating pledge (status ${response.status} ${response.statusText})`;
            throw new Error(errorMessage);
        }

        return responseData;
    } catch (error) {
        console.error("Pledge API error:", error);
        throw error;
    }
}

/**
 * WHAT HAPPENS AFTER THIS SUCCEEDS:
 * 
 * 1. Backend saves the pledge to database
 * 2. Django SIGNAL fires (post_save on Pledge)
 * 3. Signal appends add_content to project.starting_content
 * 4. Project is automatically updated!
 * 5. Response sent back to frontend
 * 6. Frontend can refresh to show new content
 */