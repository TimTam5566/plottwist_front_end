const ERROR_MESSAGES = {
    PROJECT_REQUIRED: "Project ID is required",
    AUTH_REQUIRED: "Authentication required",
    BAD_REQUEST: "Please check your pledge details"
};

export default async function postPledge(projectId, pledgeData) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No authentication token found");
    }

    // Use correct URL format
    const url = `${import.meta.env.VITE_API_URL}/projects/${projectId}/pledges/`;

    console.log("Sending pledge request:", {
        url,
        projectId,
        hasToken: !!token,
        payload: pledgeData
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                amount: pledgeData.amount,
                add_content: pledgeData.add_content,
                comment: pledgeData.comment || `Contributed ${pledgeData.amount} verse(s)`,
                anonymous: pledgeData.anonymous
            })
        });

        console.log("Pledge response received:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        let responseData;
        try {
            responseData = await response.json();
            console.log("Response data:", responseData);
        } catch (e) {
            console.log("No JSON response body");
            responseData = null;
        }

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

