/**
 * ============================================================
 * GET-PROJECT.JS - Fetch Single Project by ID
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Fetches ONE specific project with all its details including pledges.
 * 
 * WHEN IT'S USED:
 * - ProjectPage to show full project details
 * - EditProject to load current data for editing
 * 
 * API ENDPOINT: GET /projects/{id}/
 * AUTHENTICATION: Not required (public endpoint)
 * 
 * PARAMETER:
 * - projectId: The ID of the project to fetch (number)
 */
async function getProject(projectId) {
    // Build URL with the project ID
    // Example: "https://your-api.herokuapp.com/projects/5"
    const url = `${import.meta.env.VITE_API_URL}/projects/${projectId}`;
    // Send GET request
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
        const fallbackError = `Error fetching project with id ${projectId}`;
        // Check if response is JSON before trying to parse
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json().catch(() => {
                throw new Error(fallbackError);
            });
            const errorMessage = data?.detail ?? fallbackError;
            throw new Error(errorMessage);
        } else {
            // Response is not JSON (maybe HTML error page)
            throw new Error(fallbackError);
        }
    }
    // Return the project data
    return await response.json();
}

export default getProject;

/**
 * EXAMPLE RESPONSE (uses ProjectDetailSerializer):
 * {
 *   "id": 1,
 *   "title": "The Haunted Lighthouse",
 *   "description": "A spooky collaborative tale...",
 *   "goal": 10,
 *   "image": "https://res.cloudinary.com/...",
 *   "genre": "Horror",
 *   "content_type": "story",
 *   "owner": 1,
 *   "starting_content": "The lighthouse stood alone on the cliff...",
 *   "current_content": "The lighthouse stood alone... The door creaked...",
 *   "is_open": true,
 *   "date_created": "2024-01-15T10:30:00Z",
 *   "pledges": [                    // 👈 Nested pledges!
 *     {
 *       "id": 1,
 *       "amount": 2,
 *       "add_content": "The door creaked open...",
 *       "supporter": 3,
 *       "anonymous": false
 *     }
 *   ]
 * }
 */
